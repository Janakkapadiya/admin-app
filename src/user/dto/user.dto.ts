import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { RoleEnum } from 'src/user/enums/user.role';

export class UserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly roles: RoleEnum;
}
