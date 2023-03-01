import { IsEmail, IsNotEmpty, IsString, IsUppercase } from 'class-validator';
import { RoleEnum } from '../../user/enums/user.role';

export class AdminDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  @IsUppercase()
  roles: RoleEnum;
}
