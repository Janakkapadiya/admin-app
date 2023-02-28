import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ChangePassword {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  otp: number;
}
