import { EmailModule } from './email/email.module';
import { TransactionModule } from './transaction/transaction.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeORM/entityConfig';
import { AuthModule } from './auth/auth.module';
import { rootConfigModule } from './config.module';

@Module({
  imports: [
    AuthModule,
    TransactionModule,
    EmailModule,
    rootConfigModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '88998899',
      database: 'admin_panel',
      entities,
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
