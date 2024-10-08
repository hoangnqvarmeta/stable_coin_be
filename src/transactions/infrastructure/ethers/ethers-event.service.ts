// src/event-services/ethereum-event.service.ts
import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import fs from 'fs';
import Web3 from 'web3';
import { UsersService } from '../../../users/users.service';
import { BadRequest } from '../../../utils/response';
import { TransactionServiceInterface } from '../persistence/transaction-service.interface';

@Injectable()
export class EthereumEventService implements TransactionServiceInterface {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private abi: any;
  private signer: ethers.Wallet;
  private web3: Web3;

  constructor(private readonly userService: UsersService) {
    this.provider = new ethers.JsonRpcProvider(process.env.ETHER_RPC);
    const abi = fs.readFileSync('./smart-contract/USDC.json', 'utf8');
    this.abi = JSON.parse(abi);
    const privateKey = process.env.ETHER_ADMIN_PRIVATE_KEY;
    this.signer = new Wallet(privateKey!, this.provider);

    this.contract = new ethers.Contract(
      process.env.ETHER_CONTRACT_ADDRESS!,
      this.abi,
      this.signer,
    );
    this.web3 = new Web3();
  }

  verifySignature(meesage: string, signature: string, address: string) {
    const signer = this.web3.eth.accounts.recover(meesage, signature);
    return signer.toLowerCase() === address.toLowerCase();
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
      throw new BadRequest(error.message);
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
      throw new BadRequest(error.message);
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
  async configureMinter(amount: number) {
    const minter = await this.signer.getAddress();
    const value = this.convertToUSDCAmount(amount);
    try {
      const tx = await this.contract.configureMinter(minter, value);
      return tx.wait();
    } catch (error) {
      console.error('Error configuring minter:', error);
      throw new BadRequest(error.message);
    }
  }

  async checkBalanceAndEstimateGas(
    method: string,
    params: any[],
  ): Promise<void> {
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    console.log('🚀 ~ EthereumEventService ~ balance:', balance);

    try {
      const estimatedGas = await this.contract.estimateGas[method](...params);
      console.log('🚀 ~ EthereumEventService ~ estimatedGas:', estimatedGas);
      if (balance < estimatedGas) {
        throw new BadRequest('Insufficient balance to cover gas fees');
      }
    } catch (error) {
      console.error(`Error estimating gas for ${method}:`, error);
      throw new BadRequest(
        `Failed to estimate gas for ${method}: ${error.message}`,
      );
    }
  }

  async mintUSDC(toAddress: string, amount: number) {
    try {
      await this.configureMinter(amount);
      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.mint(toAddress, value);
      const txReceipt = await tx.wait();
      return txReceipt;
    } catch (error) {
      console.error('Error minting USDC:', error);
      throw new BadRequest(error.message);
    }
  }
  async getAllowance(spender: string) {
    const owner = await this.signer.getAddress();
    try {
      const token = await this.contract.allowance(owner, spender);
      return token;
    } catch (error) {
      console.error('Error setting allowance:', error);
      throw new BadRequest(error.message);
    }
  }
  async setAllowance(spender: string, amount: number) {
    try {
      const value = this.convertToUSDCAmount(amount);
      const user = await this.userService.findOne({
        publicAddress: spender,
      });
      if (!user) throw new BadRequest('User not found');

      const owner = new Wallet(user.privateAddress, this.provider);
      const contract = new ethers.Contract(
        process.env.ETHER_CONTRACT_ADDRESS!,
        this.abi,
        owner,
      );
      const tx = await contract.approve(this.signer.getAddress(), value);
      return tx.wait();
    } catch (error) {
      console.error('Error setting allowance:', error);
      throw new BadRequest(error.message);
    }
  }
  async collectAllToken(spender: string) {
    try {
      const allow = await this.getAllowance(spender);
      const balance = await this.contract.balanceOf(spender);
      const value = balance < allow ? balance : allow;
      const tx = await this.contract.transferFrom(
        spender,
        this.signer.getAddress(),
        value,
      );
      return tx.wait();
    } catch (error) {
      console.error('Error setting allowance:', error);
      throw new BadRequest(error.message);
    }
  }

  async transferUSDC(
    fromAddr: string,
    toAddr: string,
    amount: number,
  ): Promise<boolean> {
    try {
      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.transferFrom(fromAddr, toAddr, value);
      return tx.wait();
    } catch (error) {
      console.error('Error transferring USDC:', error);
      throw new BadRequest(error.message);
    }
  }

  async burnUSDC(amount: number): Promise<boolean> {
    try {
      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.burn(value);
      return tx.wait();
    } catch (error) {
      console.error('Error burning USDC:', error);
      throw new BadRequest(error.message);
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
      throw new BadRequest(error.message);
    }
  }

  async getCurrentBlockNumber(): Promise<number> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('Error fetching current block number:', error);
      throw new BadRequest(error.message);
    }
  }
}
