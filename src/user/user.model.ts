import { InternalServerErrorException } from '@nestjs/common';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './enums/user.role';
import { Transaction } from 'src/transaction/transaction.model';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'user_email',
  })
  email: string;

  @Column({
    name: 'user_password',
    select: false,
  })
  password: string;

  @Column({
    name: 'user_firstName',
  })
  firstName: string;

  @Column({
    name: 'user_lastName',
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.User,
  })
  roles: RoleEnum;

  @Column({
    name: 'user_otp',
    default: 0,
    select: false,
  })
  otp: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transaction: Transaction[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        ...error.response,
      });
    }
  }
}
