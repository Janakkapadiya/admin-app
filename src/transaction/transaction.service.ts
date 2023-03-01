import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.model';
import { Repository } from 'typeorm';
import { TransactionDto } from './dto/transactionDto';
import { User } from 'src/user/user.model';
import { UpdateTransactionDto } from './dto/updateTransaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async createTransaction(transactionDto: TransactionDto, user: User) {
    const trans = new Transaction();
    trans.userId = user.id;
    Object.assign(trans, transactionDto);
    this.transactionRepo.create(trans);
    return await this.transactionRepo.save(trans);
  }

  async deleteTransaction(id: number) {
    const tran = await this.transactionRepo.findOne({
      where: { id },
    });
    await this.transactionRepo.remove(tran);
    return { success: true, tran };
  }

  async getTransaction(id: number) {
    try {
      return await this.transactionRepo.findOne({
        where: { id },
      });
    } catch (err) {
      return err.message;
    }
  }

  async getAllTransaction(query?: string) {
    const myQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user');

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query); // get the keys of the query string

      if (queryKeys.includes('title')) {
        myQuery.where('transaction.title LIKE :title', {
          title: `%${query['title']}%`,
        });
      }

      if (queryKeys.includes('sort')) {
        myQuery.orderBy('transaction.title', query['sort'].toUpperCase());
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionRepo.findOne({ where: { id } });

    if (!transaction) {
      throw new BadRequestException('transaction not found');
    }

    transaction.title = updateTransactionDto.title;
    transaction.content = updateTransactionDto.content;
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepo.save(transaction);
  }
}
