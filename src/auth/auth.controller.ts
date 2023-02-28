import { LoginDto } from './dto/login';
import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/createUser';
import { ApplyUser } from './user.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { CurrentUser } from './user.decorator';
import { ChangePassword } from './dto/changePassword';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async userLogIn(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.authService.login(loginDto as LoginDto);

    res.cookie('isAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authenticated', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.send({ success: true, user });
  }

  @Post('admin/createUser')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.authService.createUser(createUserDto, res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Post('change-password')
  @UsePipes(ValidationPipe)
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
