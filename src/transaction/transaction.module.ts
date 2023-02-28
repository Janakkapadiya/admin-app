/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Transaction } from './transaction.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
