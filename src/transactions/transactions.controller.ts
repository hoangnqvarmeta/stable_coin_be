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

  @Post('mint')
  @ApiOperation({ summary: 'Mint USDC for a given address' })
  @ApiBody({
    type: MintDto,
    description: 'Details of the dto to mint, including address and quantity.',
  })
  @ApiOkResponse({
    type: EtherTransactionResponse,
    description: 'Tokens minted for the specified address.',
  })
  mint(@Body() body: MintDto): Promise<EtherTransactionResponse | undefined> {
    return this.transactionsService.mint(body);
  }

  @Post('create-account')
  @ApiOperation({ summary: 'Create a new Ethereum account' })
  @ApiOkResponse({
    description: 'New Ethereum account created successfully.',
  })
  createAccount() {
    return this.transactionsService.createAccount();
  }

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

  @Post('burn')
  @ApiOperation({ summary: 'Burn USDC ' })
  @ApiBody({
    type: BurnTokenDto,
    description: 'Burn USDC of tresure account amount.',
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
