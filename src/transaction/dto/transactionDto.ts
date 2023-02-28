import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
