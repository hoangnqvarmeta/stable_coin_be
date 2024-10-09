import { Injectable } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { TransactionDomain } from './domain/transaction';
import { BurnTokenDto, MintDto, TransferTokenDto } from './dto/mint-dto';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import { TransactionEntity } from './infrastructure/persistence/relational/entities/transaction.entity';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { UsersService } from '../users/users.service';

export interface ITransactionsService {
  create(data: TransactionEntity): Promise<TransactionEntity>;
  findByTxHash(txHash: string): Promise<any>;
  remove(id: TransactionEntity['id']): Promise<void>;
}

@Injectable()
export default class TransactionsService implements ITransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly ethereumEventService: EthereumEventService,
    private readonly userService: UsersService,
  ) {}
  findOne(
    fields: EntityCondition<TransactionDomain>,
  ): Promise<TransactionEntity | null> {
    return this.transactionRepository.findOne(fields);
  }
  create(createTransactionDto: TransactionEntity) {
    return this.transactionRepository.create(createTransactionDto);
  }

  async mint(body: MintDto) {
    return this.ethereumEventService.mintUSDC(body.address, body.amount);
  }

  async createAccount() {
    const wallet = this.ethereumEventService.createAccount();
    const user = await this.userService.create({
      publicAddress: wallet.address,
      privateAddress: wallet.privateKey,
      mnemonic: wallet.mnemonic?.entropy || '',
    });
    await this.ethereumEventService.setAllowance(wallet.address);
    return { walletAddress: user.publicAddress };
  }
  async burn(body: BurnTokenDto) {
    return this.ethereumEventService.burnUSDC(body.amount);
  }

  async transfer(body: TransferTokenDto) {
    return this.ethereumEventService.transferUSDC(
      body.fromAddr,
      body.toAddr,
      body.amount,
    );
  }

  async findByTxHash(txHash: string) {
    const events = await this.ethereumEventService.getTransactionData(txHash);

    return events;
  }

  remove(id: TransactionEntity['id']) {
    return this.transactionRepository.remove(id);
  }
}
