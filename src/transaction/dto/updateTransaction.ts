import { IsString } from 'class-validator';
export class UpdateTransactionDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
