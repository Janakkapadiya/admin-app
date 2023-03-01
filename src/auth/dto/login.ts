import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'password',
  })
  password: string;
}
