import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Transaction ID', type: Number })
  public id: number;

  @Column({ type: String, nullable: false, unique: true })
  @ApiProperty({
    description: 'Transaction hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public txHash: string;

  @Column()
  @ApiProperty({ description: 'Currency', type: String, example: 'ETH' })
  public currency: string;

  @Column()
  @ApiProperty({ description: 'Type', type: String, example: 'INVOKE' })
  public type: string;

  @Column()
  @ApiProperty({
    description: 'From address',
    type: String,
    example: '0x123456',
  })
  public fromAddress: string;

  @Column()
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  public contractAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  public data: object | null;

  @Column({ type: String, nullable: true })
  @ApiProperty({ type: String, nullable: true })
  public errorMessage: string | null;

  @Column()
  @ApiProperty({ description: 'Status', type: String, example: 'pending' })
  public status: string;

  @Column({ type: String, nullable: true })
  @ApiProperty({
    description: 'Unsigned transaction hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public unsignedtxHash: string;

  @Column('bigint', { nullable: true })
  @ApiProperty({ description: 'Block number', type: Number, nullable: true })
  public blockNumber: number | null;

  @Column({ type: String, nullable: true })
  @ApiProperty({
    description: 'Block hash',
    type: String,
    example: '0x123456',
    nullable: true,
  })
  public blockHash: string | null;

  @Column('bigint', { nullable: true })
  @ApiProperty({ description: 'Block timestamp', type: Number, nullable: true })
  public blockTimestamp: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Fee amount',
    type: String,
    example: '0.001',
    nullable: true,
  })
  public feeAmount: string;

  @Column({ type: String, nullable: true })
  @ApiProperty({ description: 'Unsigned raw', type: String, nullable: true })
  public unsignedRaw: string | null;

  @Column({ type: String, nullable: true })
  @ApiProperty({ description: 'Signed raw', type: String, nullable: true })
  public signedRaw: string | null;
}
