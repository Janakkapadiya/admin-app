import { Roles } from 'src/auth/roles.decoretor';
import { LoginDto } from './dto/login';
import { Body, Controller, Post, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/createUser';
import { ApplyUser } from './user.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { CurrentUser } from './user.decorator';
import { ChangePassword } from './dto/changePassword';
import { AuthGuard } from '@nestjs/passport';
import { AdminDto } from './dto/adminDto';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('createAdmin')
  async createAdmin(@Body() adminDto: AdminDto, @Res() res: Response) {
    try {
      await this.authService.createAdmin(adminDto, res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Post('admin/createUser')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  // @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.authService.createUser(createUserDto, res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async userLogIn(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.authService.login(loginDto as LoginDto);

    res.cookie('isAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authenticated', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.send({ success: true, user });
  }

  @Post('change-password')
  async changePassword(
    @Body() changeUserPassword: ChangePassword,
    @Res() res: Response,
  ) {
    try {
      await this.authService.changePassword(changeUserPassword, res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('Authenticated');
    res.clearCookie('isAuthenticated');
    return res.status(200).send({ success: true });
  }

  @Get('authstatus')
  @UseGuards(ApplyUser)
  authStatus(@CurrentUser() user: User) {
    return { status: !!user, user };
  }
}
