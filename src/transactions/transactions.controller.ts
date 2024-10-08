import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  BurnTokenDto,
  CollectionAllowanceDto,
  MintDto,
  SetAlllowanceDto,
  TransferTokenDto,
} from './dto/mint-dto';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import TransactionsService from './transactions.service';
import { EtherTransactionResponse } from './domain/ether-tx-reponse';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
  @ApiParam({
    name: 'txHash',
    type: String,
    required: true,
  })
  findByHash(@Param('txHash') txHash: string) {
    return this.transactionsService.findByTxHash(txHash);
  }

  @Post('allowance')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  setAllowance(@Body() body: SetAlllowanceDto) {
    return this.ethereumEventService.setAllowance(body.spender, body.amount);
  }
  @Post('collect-token')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  collectToken(@Body() body: CollectionAllowanceDto) {
    return this.ethereumEventService.collectAllToken(body.spender);
  }
  @Post('mint')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  mint(@Body() body: MintDto) {
    return this.transactionsService.mint(body);
  }
  @Post('create-account')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  createAccount() {
    return this.transactionsService.createAccount();
  }
  @Post('transfer')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  transfer(@Body() body: TransferTokenDto) {
    return this.transactionsService.transfer(body);
  }
  @Post('burn')
  @ApiOkResponse({
    type: EtherTransactionResponse,
  })
  burn(@Body() body: BurnTokenDto) {
    return this.transactionsService.burn(body);
  }
}
