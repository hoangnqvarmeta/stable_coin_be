import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import { TransactionsController } from './transactions.controller';
import TransactionsService from './transactions.service';

@Module({
  imports: [UsersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, EthereumEventService],
  exports: [TransactionsService, EthereumEventService],
})
export class TransactionsModule {}
