import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({
    name: 'transaction_id',
  })
  id: number;

  @Column({
    name: 'title',
  })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  @Exclude()
  userId: number;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
  })
  user: User;
}
