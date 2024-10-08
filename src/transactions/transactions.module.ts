import { Module } from '@nestjs/common';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import { RelationalTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TransactionServiceFactory } from './infrastructure/persistence/transaction-service.factory';
import { TransactionsController } from './transactions.controller';
import TransactionsService from './transactions.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RelationalTransactionPersistenceModule, UsersModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    EthereumEventService,
    TransactionServiceFactory,
  ],
  exports: [
    TransactionsService,
    EthereumEventService,
    TransactionServiceFactory,
    RelationalTransactionPersistenceModule,
  ],
})
export class TransactionsModule {}
