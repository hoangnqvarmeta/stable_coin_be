// src/event-services/ethereum-event.service.ts
import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import fs from 'fs';
import Web3 from 'web3';
import { UsersService } from '../../../users/users.service';
import { BadRequest } from '../../../utils/response';
import { EtherTransaction } from '../../domain/ether-tx-reponse';
const MAX_BIG_INT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

@Injectable()
export class EthereumEventService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private abi: any;
  private signer: ethers.Wallet;
  private web3: Web3;

  constructor(private readonly userService: UsersService) {
    this.provider = new ethers.JsonRpcProvider(process.env.ETHER_RPC);
    const abi = fs.readFileSync('./smart-contract/USDC.json', 'utf8');
    this.abi = JSON.parse(abi);
    this.signer = this.initializeSigner();
    this.contract = this.initializeContract();
    this.web3 = new Web3();
  }

  private initializeSigner(): ethers.Wallet {
    const privateKey = process.env.ETHER_ADMIN_PRIVATE_KEY;
    return new Wallet(privateKey!, this.provider);
  }

  private initializeContract(): ethers.Contract {
    const abi = this.getAbiFromFile('./smart-contract/USDC.json');
    const contractAddress = process.env.ETHER_CONTRACT_ADDRESS!;
    return new ethers.Contract(contractAddress, abi, this.signer);
  }

  private getAbiFromFile(path: string): any {
    const abi = fs.readFileSync(path, 'utf8');
    return JSON.parse(abi);
  }

  private handleError(error: any, customMessage?: string) {
    const errorMessage = customMessage || error.message || 'Unknown error';
    console.error(`Error: ${errorMessage}`, error);
    throw new BadRequest(errorMessage);
  }

  verifySignature(
    message: string,
    signature: string,
    address: string,
  ): boolean {
    const signer = this.web3.eth.accounts.recover(message, signature);
    return signer.toLowerCase() === address.toLowerCase();
  }

  async getTransactionData(txHash: string): Promise<any> {
    try {
      const transaction = await this.provider.getTransactionReceipt(txHash);
      if (!transaction) {
        throw new BadRequest('Transaction not found');
      }
      return transaction;
    } catch (error) {
      this.handleError(error, 'Error fetching transaction data');
    }
  }

  convertToUSDCAmount(amount: number): bigint {
    return ethers.parseUnits(amount.toString(), 6);
  }

  async getEventWithTransactionHash(txHash: string) {
    try {
      const txReceipt = await this.provider.getTransactionReceipt(txHash);
      if (!txReceipt) {
        throw new BadRequest('Transaction not found');
      }
      return this.contract.interface.parseLog(txReceipt.logs[0]);
    } catch (error) {
      this.handleError(error, 'Error fetching event by transaction hash');
    }
  }
  createAccount(): ethers.HDNodeWallet {
    return ethers.Wallet.createRandom().connect(this.provider);
  }

  async configureMinter() {
    try {
      const minter = await this.signer.getAddress();
      const tx = await this.contract.configureMinter(minter, MAX_BIG_INT);
      await tx.wait();
      return EtherTransaction.toTxHash(tx);
    } catch (error) {
      this.handleError(error, 'Error configuring minter');
    }
  }

  async mintUSDC(toAddress: string, amount: number) {
    try {
      const balance = await this.contract.balanceOf(this.signer.address);
      if (amount > balance)
        throw new BadRequest('Insufficient balance to mint');

      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.mint(toAddress, value);
      await tx.wait(1);
      return EtherTransaction.toTxHash(tx);
    } catch (error) {
      this.handleError(error, 'Error minting USDC');
    }
  }

  async getAllowance(spender: string) {
    try {
      const owner = await this.signer.getAddress();
      return await this.contract.allowance(owner, spender);
    } catch (error) {
      this.handleError(error, 'Error getting allowance');
    }
  }

  async setAllowance(spender: string) {
    try {
      const user = await this.userService.findOne({ publicAddress: spender });
      if (!user) throw new BadRequest('User not found');

      await this.sendNativeTransaction(spender);
      return await this.approveAllowance(user.privateAddress);
    } catch (error) {
      this.handleError(error, 'Error setting allowance');
    }
  }

  private async sendNativeTransaction(spender: string) {
    const amountInWei = ethers.parseEther('0.00001');
    const tx = await this.signer.sendTransaction({
      to: spender,
      value: amountInWei,
    });
    await tx.wait();
  }

  private async approveAllowance(userPrivateKey: string) {
    const owner = new Wallet(userPrivateKey, this.provider);
    const contract = new ethers.Contract(
      process.env.ETHER_CONTRACT_ADDRESS!,
      this.abi,
      owner,
    );
    const tx = await contract.approve(this.signer.getAddress(), MAX_BIG_INT);
    await tx.wait();
    return EtherTransaction.toTxHash(tx);
  }

  async collectAllToken(spender: string) {
    try {
      const balance = await this.contract.balanceOf(spender);
      if (balance.eq(0)) throw new BadRequest('No tokens to collect');

      const tx = await this.contract.transferFrom(
        spender,
        this.signer.getAddress(),
        balance,
      );
      await tx.wait();
      return EtherTransaction.toTxHash(tx);
    } catch (error) {
      this.handleError(error, 'Error collecting tokens');
    }
  }

  async transferUSDC(fromAddr: string, toAddr: string, amount: number) {
    try {
      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.transferFrom(fromAddr, toAddr, value);
      await tx.wait();
      return EtherTransaction.toTxHash(tx);
    } catch (error) {
      this.handleError(error, 'Error transferring USDC');
    }
  }

  async burnUSDC(amount: number) {
    try {
      const balance = await this.contract.balanceOf(this.signer.address);
      if (amount > balance)
        throw new BadRequest('Insufficient balance to burn');

      const value = this.convertToUSDCAmount(amount);
      const tx = await this.contract.burn(value);
      await tx.wait();
      return EtherTransaction.toTxHash(tx);
    } catch (error) {
      this.handleError(error, 'Error burning USDC');
    }
  }
}
