import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsHexadecimal,
  MaxLength,
} from 'class-validator';
import { AuthWalletProvidersEnum } from '../../auth/auth-providers.enum';

export class AuthWalletLoginDto {
  @ApiProperty({
    description:
      'The signature provided by the user to authenticate with the wallet.',
    example: 'abc123signature...',
    maxLength: 256, // You can set the maximum length based on your signature requirements
  })
  @IsNotEmpty({ message: 'Signature is required' })
  @IsString({ message: 'Signature must be a string' })
  @MaxLength(256, { message: 'Signature cannot exceed 256 characters' }) // Optional, adjust as needed
  signature: string;

  @ApiProperty({
    description:
      'The wallet address of the user, formatted as a hexadecimal string.',
    example: '0x1234567890abcdef1234567890abcdef12345678',
    pattern: '^0x[a-fA-F0-9]{40}$', // Regex pattern for Ethereum addresses
  })
  @IsNotEmpty({ message: 'Wallet address is required' })
  @IsString({ message: 'Wallet address must be a string' })
  @IsHexadecimal({
    message: 'Wallet address must be a valid hexadecimal string',
  })
  address: string;

  @ApiProperty({
    description: 'The wallet provider used for authentication.',
    enum: AuthWalletProvidersEnum,
    example: AuthWalletProvidersEnum.metamask,
    type: 'string', // Specify that it's a string representation of the enum
  })
  @IsNotEmpty({ message: 'Wallet provider is required' })
  @IsString({ message: 'Wallet provider must be a string' })
  @IsEnum(AuthWalletProvidersEnum, { message: 'Invalid wallet provider' })
  walletProvider: AuthWalletProvidersEnum;
}
