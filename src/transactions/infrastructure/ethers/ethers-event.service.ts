// src/event-services/ethereum-event.service.ts
import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import fs from 'fs';
import Web3 from 'web3';
import { UsersService } from '../../../users/users.service';
import { BadRequest } from '../../../utils/response';
import BigNumber from 'bignumber.js';
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
    const errorMessage = error.message || customMessage || 'Unknown error';
    console.error(`Error: ${errorMessage}`, error);
    throw new BadRequest(errorMessage);
  }
  /**
   * Verify a signature given the message, signature and address.
   * @param message The message that was signed.
   * @param signature The signature to verify.
   * @param address The address of the signer.
   * @returns True if the signature is valid, false otherwise.
   */
  verifySignature(
    message: string,
    signature: string,
    address: string,
  ): boolean {
    const signer = this.web3.eth.accounts.recover(message, signature);
    return signer.toLowerCase() === address.toLowerCase();
  }

  /**
   * Fetches the data of a transaction given its hash.
   * @param txHash The transaction hash.
   * @returns The transaction data.
   * @throws {BadRequest} If the transaction is not found.
   * @throws {Error} If there is an error fetching the transaction data.
   */
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

  /**
   * Converts a USDC amount to a bigint.
   * @param amount The amount of USDC to convert.
   * @returns The converted amount as a bigint.
   */
  convertToUSDCAmount(amount: number): bigint {
    return ethers.parseUnits(amount.toString(), 6);
  }

  /**
   * Fetches an event given its transaction hash.
   * @param txHash The transaction hash.
   * @returns The event.
   * @throws {BadRequest} If the transaction is not found.
   * @throws {Error} If there is an error fetching the event.
   */
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
  /**
   * Generates a new random wallet and connects it to the provider.
   * @returns A connected wallet.
   */
  createAccount(): ethers.HDNodeWallet {
    return ethers.Wallet.createRandom().connect(this.provider);
  }

  /**
   * Configure the minter account.
   * @returns The transaction hash of the configureMinter transaction.
   */
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

  /**
   * Mint a specified amount of USDC to a given address.
   * @param toAddress The address to mint the USDC to.
   * @param amount The amount of USDC to mint.
   * @returns The transaction hash of the mint transaction.
   */
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

  /**
   * Get the allowance of a spender.
   * @param spender The address of the spender to get the allowance of.
   * @returns The allowance of the spender.
   */
  async getAllowance(spender: string) {
    try {
      const owner = await this.signer.getAddress();
      return await this.contract.allowance(owner, spender);
    } catch (error) {
      this.handleError(error, 'Error getting allowance');
    }
  }

  /**
   * Sets the allowance of the spender to the value of the native token that the minter has.
   * First, it checks if the user is registered in the DB and if not, throws an error.
   * Then, sends a native token transaction to the spender and then calls the approveAllowance
   * method to set the allowance.
   * @param spender The address of the spender to set the allowance of.
   * @returns The transaction hash of the approveAllowance transaction.
   */
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

  /**
   * Sends a native token transaction to the given spender.
   * @param spender The address to send the native token to.
   * @returns The transaction hash of the transaction.
   * @private
   */
  /******  7a9c2197-b287-4096-9c78-08e197045108  *******/
  private async sendNativeTransaction(spender: string) {
    let estimatedGas;
    try {
      estimatedGas = await this.contract.approve.estimateGas(
        spender,
        MAX_BIG_INT,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequest(`Failed to estimate gas for`);
    }

    const gasPrice = await this.provider.getFeeData();
    const estimatedCost = new BigNumber(`${gasPrice.maxFeePerGas!}`)
      .multipliedBy(estimatedGas)
      .multipliedBy(4)
      .valueOf();
    const fee = new BigNumber(estimatedCost.toString())
      .dividedBy(10 ** 18)
      .valueOf();
    const amountInWei = ethers.parseEther(fee);
    const tx = await this.signer.sendTransaction({
      to: spender,
      value: amountInWei,
    });
    await tx.wait();
  }

  /**
   * Calls the approve method on the ERC20 contract to set the allowance of
   * the given user to the value of the MAX_BIG_INT.
   * @param userPrivateKey The private key of the user to set the allowance of.
   * @returns The transaction hash of the transaction.
   * @private
   */
  async approveAllowance(userPrivateKey: string) {
    const owner = new Wallet(userPrivateKey, this.provider);
    const contract = new ethers.Contract(
      process.env.ETHER_CONTRACT_ADDRESS!,
      this.abi,
      owner,
    );
    const tx = await contract.approve(this.signer.getAddress(), MAX_BIG_INT);
    return EtherTransaction.toTxHash(tx);
  }

  /**
   * Collects all tokens from the given spender address.
   * @param spender The address to collect the tokens from.
   * @returns The transaction hash of the collect transaction.
   * @throws {BadRequest} If there are no tokens to collect.
   * @throws {Error} If there is an error collecting the tokens.
   */
  /******  251e7abd-77ad-49ab-a9d2-3892207189eb  *******/
  async collectAllToken(spender: string) {
    try {
      const balance = await this.contract.balanceOf(spender);
      if (balance == 0) throw new BadRequest('No tokens to collect');

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

  /**
   * Transfers the given amount of USDC from the given fromAddr to the given
   * toAddr.
   * @param fromAddr The address to transfer the USDC from.
   * @param toAddr The address to transfer the USDC to.
   * @param amount The amount of USDC to transfer.
   * @returns The transaction hash of the transfer transaction.
   * @throws {BadRequest} If the from address does not have enough balance to
   * transfer the given amount of USDC.
   * @throws {Error} If there is an error transferring the USDC.
   */
  /******  b9329210-2c46-4c22-b668-1cfad591a6c2  *******/
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

  /**
   * Burns the given amount of USDC from the signer's account.
   * @param amount The amount of USDC to burn.
   * @returns The transaction hash of the burn transaction.
   * @throws {BadRequest} If the signer does not have enough balance to burn the given
   * amount of USDC.
   * @throws {Error} If there is an error burning the USDC.
   */
  /******  2db85fda-3f59-41a5-acdc-ad30a056fb2a  *******/
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
