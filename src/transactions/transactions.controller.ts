import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EtherTransactionResponse } from './domain/ether-tx-reponse';
import {
  BurnTokenDto,
  CollectionAllowanceDto,
  MintDto,
  SetAlllowanceDto,
  TransferTokenDto,
} from './dto/mint-dto';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import TransactionsService from './transactions.service';

@ApiTags('Transactions')
@Controller({
  path: 'transactions',
  version: '1',
})
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly ethereumEventService: EthereumEventService,
  ) {}

  /**
   * Retrieves a transaction by its hash.
   * @param txHash - The transaction hash (TxHash) to search for.
   * @returns The transaction data corresponding to the provided hash.
   */
  @Get(':txHash')
  @ApiOperation({ summary: 'Get transaction by hash' })
  @ApiParam({
    name: 'txHash',
    type: String,
    required: true,
    description:
      'Transaction hash used to identify the transaction on the blockchain.',
    example:
      '0x1234abcd5678efgh9012ijklmnopqrstuvwx3456yz7890ab12cd3456ef7890gh',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Transaction details found by the given transaction hash.',
  })
  findByHash(
    @Param('txHash') txHash: string,
  ): Promise<EtherTransactionResponse | undefined> {
    return this.transactionsService.findByTxHash(txHash);
  }

  /**
   * Set the allowance for a specific token spender.
   * @param body - Contains the spender address for setting the allowance.
   * @returns A response indicating the allowance has been set.
   */
  @Post('allowance')
  @ApiOperation({ summary: 'Set token allowance for a spender' })
  @ApiBody({
    type: SetAlllowanceDto,
    description: 'Details of the spender address to set the token allowance.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Allowance set for the specified spender address.',
  })
  setAllowance(
    @Body() body: SetAlllowanceDto,
  ): Promise<EtherTransactionResponse | undefined> {
    return this.ethereumEventService.setAllowance(body.spender);
  }

  /**
   * Collect all tokens for a specified allowance.
   * @param body - Contains the spender address for collecting tokens.
   * @returns A response indicating the collection was successful.
   */
  @Post('collect-token')
  @ApiOperation({ summary: 'Collect all allowed tokens for a spender' })
  @ApiBody({
    type: CollectionAllowanceDto,
    description: 'Details of the spender address for collecting all tokens.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Tokens collected for the specified allowance.',
  })
  collectToken(
    @Body() body: CollectionAllowanceDto,
  ): Promise<EtherTransactionResponse | undefined> {
    return this.ethereumEventService.collectAllToken(body.spender);
  }

  /**
   * Mints a new token based on the provided minting details.
   * @param body - Minting details including token type and quantity.
   * @returns A response indicating the minting was successful.
   */
  @Post('mint')
  @ApiOperation({ summary: 'Mint new tokens' })
  @ApiBody({
    type: MintDto,
    description: 'Details of the tokens to mint, including type and quantity.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'New tokens successfully minted.',
  })
  mint(@Body() body: MintDto): Promise<EtherTransactionResponse | undefined> {
    return this.transactionsService.mint(body);
  }

  /**
   * Creates a new account on the Ethereum blockchain.
   * @returns A response with the details of the created account.
   */
  @Post('create-account')
  @ApiOperation({ summary: 'Create a new Ethereum account' })
  @ApiOkResponse({
    description: 'New Ethereum account created successfully.',
  })
  createAccount() {
    return this.transactionsService.createAccount();
  }

  /**
   * Transfer tokens from one account to another.
   * @param body - Transfer details including recipient address, amount, and token type.
   * @returns A response indicating the transfer was successful.
   */
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer tokens to another address' })
  @ApiBody({
    type: TransferTokenDto,
    description:
      'Details of the transfer, including recipient address, token amount, and type.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Tokens successfully transferred to the recipient address.',
  })
  transfer(
    @Body() body: TransferTokenDto,
  ): Promise<EtherTransactionResponse | undefined> {
    return this.transactionsService.transfer(body);
  }

  /**
   * Burns tokens from the caller's account.
   * @param body - Details of the token to burn including token ID and amount.
   * @returns A response indicating the tokens were successfully burned.
   */
  @Post('burn')
  @ApiOperation({ summary: 'Burn tokens' })
  @ApiBody({
    type: BurnTokenDto,
    description: 'Details of the token to burn, including token ID and amount.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Tokens successfully burned.',
  })
  burn(
    @Body() body: BurnTokenDto,
  ): Promise<EtherTransactionResponse | undefined> {
    return this.transactionsService.burn(body);
  }
}
