import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class UpdateTransactionDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;
}
