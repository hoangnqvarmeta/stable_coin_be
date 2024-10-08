// src/event-services/ethereum-event.service.ts
import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import fs from 'fs';
import { BadRequest } from '../../../utils/response';
import { TransactionServiceInterface } from '../persistence/transaction-service.interface';

@Injectable()
export class EthereumEventService implements TransactionServiceInterface {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private abi: any;
  private signer: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://sepolia.drpc.org');
    const abi = fs.readFileSync('./smart-contract/USDC.json', 'utf8');
    this.abi = JSON.parse(abi);
    const privateKey = process.env.ETHER_ADMIN_PRIVATE_KEY;
    this.signer = new Wallet(privateKey!, this.provider);

    this.contract = new ethers.Contract(
      '0x3f5d5d379f6B0E6Fc09FBc750e4186B7C5428825',
      this.abi,
      this.signer,
    );
  }
  async getTransactionData(txHash: string): Promise<any> {
    try {
      const transaction = await this.provider.getTransactionReceipt(txHash);
      if (!transaction) {
        throw new BadRequest('transactionNotFound');
      }
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      throw error;
    }
  }
  convertToUSDCAmount(amount: number): bigint {
    return ethers.parseUnits(amount.toString(), 6);
  }

  async getEventsFromContract(
    eventName: string,
    fromBlock: ethers.BlockTag,
    toBlock: ethers.BlockTag,
  ) {
    try {
      const events = await this.contract.queryFilter(
        this.contract.filters[eventName](),
        fromBlock,
        toBlock,
      );
      return this.decodeEvents(events, eventName);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEventWithTransactionHash(contract: any, txHash: string) {
    const txReceipt = await this.provider.getTransactionReceipt(txHash);
    if (!txReceipt) {
      throw new BadRequest('transactionNotFound');
    }
    const events = contract.interface.parseLog(txReceipt.logs[0]);
    console.log(events);
  }

  private decodeEvents(events: ethers.Log[], eventName: string): any[] {
    const iface = new ethers.Interface(this.abi);
    return events.map((event) => this.decodeEvent(iface, event, eventName));
  }

  createAccount(): ethers.HDNodeWallet {
    return ethers.Wallet.createRandom().connect(this.provider);
  }

  async configureMinter(minter: string, amount: number) {
    try {
      // const amount = this.convertToUSDCAmount(allowAmount);
      const tx = await this.contract.configureMinter(minter, amount);
      return tx.wait();
    } catch (error) {
      console.error('Error configuring minter:', error);
      throw error;
    }
  }

  async mintUSDC(toAddress: string, amount: number) {
    try {
      await this.configureMinter(toAddress, amount);
      const usdcAmount = this.convertToUSDCAmount(amount);
      const tx = await this.contract.mint(toAddress, usdcAmount);
      const txReceipt = await tx.wait();
      console.log(
        '🚀 ~ EthereumEventService ~ mintUSDC ~ txReceipt:',
        txReceipt,
      );
      return txReceipt.hash;
    } catch (error) {
      console.error('Error minting USDC:', error);
      throw error;
    }
  }

  async setAllowance(spender: string, amount: number): Promise<boolean> {
    try {
      const usdcAmount = this.convertToUSDCAmount(amount);
      const tx = await this.contract.approve(spender, usdcAmount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error setting allowance:', error);
      throw error;
    }
  }

  async transferUSDC(
    fromAddr: string,
    toAddr: string,
    amount: number,
  ): Promise<boolean> {
    try {
      const usdcAmount = this.convertToUSDCAmount(amount);
      const tx = await this.contract.transferFrom(fromAddr, toAddr, usdcAmount);
      const txReceipt = await tx.wait();
      console.log('🚀 ~ EthereumEventService ~ txReceipt:', txReceipt);
      return true;
    } catch (error) {
      console.error('Error transferring USDC:', error);
      throw error;
    }
  }

  async burnUSDC(amount: number): Promise<boolean> {
    try {
      const usdcAmount = this.convertToUSDCAmount(amount);
      const tx = await this.contract.burn(usdcAmount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error burning USDC:', error);
      throw error;
    }
  }

  private decodeEvent(
    iface: ethers.Interface,
    event: ethers.Log,
    eventName: string,
  ): any {
    try {
      const decodedEvent = iface.parseLog(event);
      if (decodedEvent?.name === eventName) {
        return {
          ...event,
          decodedEvent: {
            name: decodedEvent.name,
            params: decodedEvent.args,
          },
        };
      }
      return null;
    } catch (error) {
      console.error('Error decoding event:', error);
      throw error;
    }
  }

  async getCurrentBlockNumber(): Promise<number> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('Error fetching current block number:', error);
      throw error;
    }
  }
}
