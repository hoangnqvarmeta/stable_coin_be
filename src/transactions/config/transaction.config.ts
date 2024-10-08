import { registerAs } from '@nestjs/config';

import validateConfig from '@/utils/validate-config';
import { IsString } from 'class-validator';
import { TransactionConfig } from './transaction-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  STARKNET_CONTRACT_ADDRESS: string;

  @IsString()
  STARKNET_RPC: string;
}

export default registerAs<TransactionConfig>('transaction', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    starknet_contract_address:
      process.env.STARKNET_CONTRACT_ADDRESS ||
      '0x05b9d4fb17bbca50a02199a63fbb8db28d31f3870e66f7f18780474cee608d5b',
    starknet_marketplace_smct:
      process.env.STARKNET_MARKET_SMCT ||
      '0x0350e7b9fda9a0770e86bd10ae9fa79a29d7a5ad4b299ead60843060655b079b',
    starknet_usdc_smct:
      process.env.STARKNET_USDC_SMCT ||
      '0x033a33be6601600f47921adda5c352c092dd8f9166c630252380130a66aedc02',
    starknet_rpc:
      process.env.STARKNET_RPC || 'https://starknet-sepolia.public.blastapi.io',
    starknet_admin_private_key: process.env.STARKNET_ADMIN_PRIVATE_KEY || '',
    starknet_admin_public_address:
      process.env.STARKNET_ADMIN_PUBLIC_ADDRESS ||
      'https://starknet-sepolia.public.blastapi.io',
  };
});
