import { ApiProperty } from '@nestjs/swagger';
import { BaseDomain } from '../../database/common/BaseDomain';

export class TransactionDomain extends BaseDomain {
  @ApiProperty({ description: 'Transaction ID', type: Number })
  public id: number;

  @ApiProperty({
    description: 'Transaction hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public txHash: string;

  @ApiProperty({ description: 'Currency', type: String, example: 'ETH' })
  public currency: string;

  @ApiProperty({ description: 'Type', type: String, example: 'INVOKE' })
  public type: string;

  @ApiProperty({
    description: 'From address',
    type: String,
    example: '0x123456',
  })
  public fromAddress: string;

  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  public contractAddress: string;

  public data: object | null;

  @ApiProperty({ type: String, nullable: true })
  public errorMessage: string | null;

  @ApiProperty({ description: 'Status', type: String, example: 'pending' })
  public status: string;

  @ApiProperty({
    description: 'Unsigned transaction hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public unsignedtxHash: string;

  @ApiProperty({ description: 'Block number', type: Number, nullable: true })
  public blockNumber: number | null;

  @ApiProperty({
    description: 'Block hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public blockHash: string | null;

  @ApiProperty({ description: 'Block timestamp', type: Number, nullable: true })
  public blockTimestamp: number;

  @ApiProperty({
    description: 'Fee amount',
    type: String,
    example: '0.001',
    nullable: true,
  })
  public feeAmount: string;

  @ApiProperty({ description: 'Unsigned raw', type: String, nullable: true })
  public unsignedRaw: string | null;

  @ApiProperty({ description: 'Signed raw', type: String, nullable: true })
  public signedRaw: string | null;
}
