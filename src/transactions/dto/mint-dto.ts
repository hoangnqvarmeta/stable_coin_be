import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfigureMintDto {
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  minter: string;

  @ApiProperty({
    description: 'Amount',
    type: Number,
    example: '1000000000000000000',
  })
  amount: number;
}
export class MintDto {
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Amount',
    type: String,
    example: '1000000000000000000',
  })
  @IsNotEmpty()
  amount: number;
}
export class TransferTokenDto {
  @ApiProperty({
    description: 'wallet address',
    type: String,
    example: '0x123456',
  })
  fromAddr: string;
  @ApiProperty({
    description: 'wallet address',
    type: String,
    example: '0x123456',
  })
  toAddr: string;

  @ApiProperty({
    description: 'Amount',
    type: String,
    example: '1000000000000000000',
  })
  amount: number;
}
export class BurnTokenDto {
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  address: string;

  @ApiProperty({
    description: 'Amount',
    type: String,
    example: '1000000000000000000',
  })
  amount: number;
}
