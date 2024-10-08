import { ApiResponseProperty } from '@nestjs/swagger';

export class EtherTransactionResponse {
  @ApiResponseProperty({
    type: String,
    example: '0x123456',
  })
  txHash: string;
}
export class EtherTransaction {
  static toTxHash(tx: any) {
    const txHash = new EtherTransactionResponse();
    txHash.txHash = tx.hash;

    return txHash;
  }
}
