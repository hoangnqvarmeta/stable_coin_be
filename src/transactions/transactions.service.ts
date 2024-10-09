import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BurnTokenDto, MintDto, TransferTokenDto } from './dto/mint-dto';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';

@Injectable()
export default class TransactionsService {
  constructor(
    private readonly ethereumEventService: EthereumEventService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Mints a new token.
   *
   * @param {MintDto} body
   * @returns {Promise<any>}
   * @memberof TransactionsService
   */
  async mint(body: MintDto) {
    return this.ethereumEventService.mintUSDC(body.address, body.amount);
  }

  /**
   * Creates a new account.
   *
   * @returns {Promise<{ walletAddress: string }>}
   * @memberof TransactionsService
   */
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

  /**
   * Burns a token.
   *
   * @param {BurnTokenDto} body
   * @returns {Promise<any>}
   * @memberof TransactionsService
   */
  async burn(body: BurnTokenDto) {
    return this.ethereumEventService.burnUSDC(body.amount);
  }

  /**
   * Transfers a token.
   *
   * @param {TransferTokenDto} body
   * @returns {Promise<any>}
   * @memberof TransactionsService
   */
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
}
