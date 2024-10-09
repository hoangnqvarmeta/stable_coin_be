import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

/**
 * DTO for configuring the mint operation, specifying the minter address and the amount to mint.
 */
export class ConfigureMintDto {
  /**
   * The contract address for the minter.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description: 'Ethereum contract address of the minter',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'Minter address must not be empty' })
  minter: string;

  /**
   * The amount of tokens to mint.
   * @example 100
   */
  @ApiProperty({
    description: 'Amount of tokens to mint',
    type: Number,
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}

/**
 * DTO for setting an allowance for a spender to use tokens.
 */
export class SetAlllowanceDto {
  /**
   * The contract address of the spender who is allowed to use tokens.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description:
      'Ethereum contract address of the spender to set allowance for',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'Spender address must not be empty' })
  spender: string;
}

/**
 * DTO for collecting all tokens based on allowance from a spender.
 */
export class CollectionAllowanceDto {
  /**
   * The contract address of the spender to collect tokens from.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description:
      'Ethereum contract address of the spender to collect tokens from',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'Spender address must not be empty' })
  spender: string;
}

/**
 * DTO for minting tokens, specifying the target address and the amount.
 */
export class MintDto {
  /**
   * The Ethereum address to mint tokens for.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description: 'Ethereum wallet address where the tokens will be minted',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'Address must not be empty' })
  address: string;

  /**
   * The amount of tokens to mint.
   * @example 100
   */
  @ApiProperty({
    description: 'Amount of tokens to mint',
    type: Number,
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}

/**
 * DTO for transferring tokens from one account to another.
 */
export class TransferTokenDto {
  /**
   * The Ethereum address to transfer tokens from.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description: 'Ethereum wallet address to transfer tokens from',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'From address must not be empty' })
  fromAddr: string;

  /**
   * The Ethereum address to transfer tokens to.
   * @example '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E'
   */
  @ApiProperty({
    description: 'Ethereum wallet address to transfer tokens to',
    type: String,
    example: '0x02563623f96Fe1704b0C3F0F6Ea79bb76D219b6E',
  })
  @IsString()
  @IsNotEmpty({ message: 'To address must not be empty' })
  toAddr: string;

  /**
   * The amount of tokens to transfer.
   * @example 100
   */
  @ApiProperty({
    description: 'Amount of tokens to transfer',
    type: Number,
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}

/**
 * DTO for burning tokens from the caller's account.
 */
export class BurnTokenDto {
  /**
   * The amount of tokens to burn.
   * @example 100
   */
  @ApiProperty({
    description: 'Amount of tokens to burn',
    type: Number,
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}
