import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import { RelationalTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TransactionsController } from './transactions.controller';
import TransactionsService from './transactions.service';

@Module({
  imports: [RelationalTransactionPersistenceModule, UsersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, EthereumEventService],
  exports: [
    TransactionsService,
    EthereumEventService,
    RelationalTransactionPersistenceModule,
  ],
})
export class TransactionsModule {}
