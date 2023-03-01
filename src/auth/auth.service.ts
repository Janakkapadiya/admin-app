import { RoleEnum } from '../user/enums/user.role';
import { LoginDto } from './dto/login';
import { User } from 'src/user/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { ChangePassword } from './dto/changePassword';
import { Response } from 'express';
import { AdminDto } from './dto/adminDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private jwtService: JwtService,
    private mailService: EmailService,
    private configService: ConfigService,
  ) {}

  async createAdmin(adminDto: AdminDto, @Res() res: Response) {
    const { email, password, firstName, lastName, roles } = adminDto;

    const present = await this.repo.findOne({ where: { email } });

    if (present) {
      return res.status(403).json({ message: 'this admin already present' });
    } else {
      const admin = new User();
      admin.email = email;
      admin.password = password;
      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.roles = roles;

      this.repo.create(admin);
      await this.repo.save(admin);
    }
    return res.status(200).json({ message: 'admin created successfully' });
  }

  async login(loginDto: LoginDto) {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('bad credentials');
    } else {
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token = await this.jwtService.signAsync({
          email: user.email,
          id: user.id,
        });
        delete user.password;
        return { token, user };
      } else {
        throw new UnauthorizedException('bad credentials');
      }
    }
  }

  async createUser(createUserDto: CreateUserDto, @Res() res: Response) {
    const { firstName, lastName, email, roles, password } = createUserDto;

    const admin = await this.repo.findOne({ where: { roles: RoleEnum.Admin } });

    if (!admin) {
      return res.status(403).json({ message: 'Only Admin Can Add Users' });
    }

    const checkUser = await this.repo.findOne({ where: { email } });

    if (checkUser) {
      return res.status(403).json({ message: 'Please Use Different Email' });
    }

    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles;

    this.repo.create(user);
    await this.repo.save(user);
    await this.emailSend(user);
    delete user.password;

    return res.status(200).json({ message: 'otp has been send to your mail' });
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async emailSend(user: CreateUserDto) {
    const { email } = user;
    const userExist = await this.repo.findOne({ where: { email } });
    if (!userExist) {
      throw new NotFoundException(
        'otp could not be send because there is no user',
      );
    }

    const opt = Math.floor(Math.random() * 10000 + 1);

    user.otp = opt;

    await this.repo.save(user);

    await this.mailService.send({
      from: this.configService.get<string>('EMAIL_SEND_FROM'),
      to: user.email,
      subject: 'Verify User',
      html: `
      <h3>Hello ${user.firstName}!</h3>
      <p>your otp is<a>"${user.otp}"</a></p>
      <p>this otp will expire in one minute<p>
      `,
    });

    const expiryTime = 60 * 1000;

    setTimeout(() => {
      user.otp = 0;
      this.repo.save(user);
    }, expiryTime);
  }

  async changePassword(
    changeUserPassword: ChangePassword,
    @Res() res: Response,
  ) {
    const { newPassword } = changeUserPassword;

    const existUser = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.otp')
      .where('user.otp = :otp', { otp: changeUserPassword.otp })
      .andWhere('user.email = :email', { email: changeUserPassword.email })
      .getOne();

    if (!existUser) {
      return res.status(400).json({ message: 'Invalid email or OTP' });
    }

    if (
      existUser.email === changeUserPassword.email &&
      existUser.otp === changeUserPassword.otp
    ) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      existUser.password = hashedPassword;

      await this.repo.save(existUser);

      return res.status(200).json({ message: 'Password changed successfully' });
    }
  }
}
