import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BurnTokenDto, MintDto, TransferTokenDto } from './dto/mint-dto';
import { EthereumEventService } from './infrastructure/ethers/ethers-event.service';
import TransactionsService from './transactions.service';

@ApiTags('Transactions')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
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

  @Post('mint')
  mint(@Body() body: MintDto) {
    return this.transactionsService.mint(body);
  }
  @Post('create-account')
  createAccount() {
    return this.transactionsService.createAccount();
  }
  @Post('transfer')
  transfer(@Body() body: TransferTokenDto) {
    return this.transactionsService.transfer(body);
  }
  @Post('burn')
  burn(@Body() body: BurnTokenDto) {
    return this.transactionsService.burn(body);
  }
}
