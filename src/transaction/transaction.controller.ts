import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Get,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transactionDto';
import { Request } from 'express';
import { User } from 'src/user/user.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTransactionDto } from './dto/updateTransaction';
import { Roles } from 'src/auth/roles.decoretor';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('user')
@Controller('api/user/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('createTransaction')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  @UsePipes(ValidationPipe)
  @ApiBody({ type: TransactionDto })
  async createTransaction(
    @Body() transactionDto: TransactionDto,
    @Req() req: Request,
  ) {
    console.log(req.user);
    return await this.transactionService.createTransaction(
      transactionDto,
      req.user as User,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async getTransaction(@Param('id') id: number) {
    return await this.transactionService.getTransaction(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('POWERUSER', 'SUPPORTDESK')
  async getAllTransaction(@Query() query: any) {
    return await this.transactionService.getAllTransaction(query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async deleteTransaction(@Param('id') id: number) {
    return await this.transactionService.deleteTransaction(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  @ApiBody({ type: UpdateTransactionDto })
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionService.updateTransaction(
      id,
      updateTransactionDto,
    );
  }
}
