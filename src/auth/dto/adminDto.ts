import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUppercase,
} from 'class-validator';
import { RoleEnum } from 'src/user/enums/user.role';
import { ApiProperty } from '@nestjs/swagger';

export class AdminDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUppercase()
  roles: RoleEnum;
}
