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
    example: 100,
  })
  amount: number;
}
export class SetAlllowanceDto {
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  @IsString()
  @IsNotEmpty()
  spender: string;
}
export class CollectionAllowanceDto {
  @ApiProperty({
    description: 'Contract address',
    type: String,
    example: '0x123456',
  })
  @IsString()
  @IsNotEmpty()
  spender: string;
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
    type: Number,
    example: 100,
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
  @IsString()
  @IsNotEmpty()
  fromAddr: string;
  @ApiProperty({
    description: 'wallet address',
    type: String,
    example: '0x123456',
  })
  @IsString()
  @IsNotEmpty()
  toAddr: string;

  @ApiProperty({
    description: 'Amount',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  amount: number;
}
export class BurnTokenDto {
  @ApiProperty({
    description: 'Amount',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  amount: number;
}
