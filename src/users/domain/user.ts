import { BaseDomain } from '@/database/common/BaseDomain';
import { ApiProperty } from '@nestjs/swagger';

export class User extends BaseDomain {
  @ApiProperty({
    description: 'The wallet address of the user',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  publicAddress: string;
  @ApiProperty({
    description: 'The wallet address of the user',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  privateAddress: string;
  @ApiProperty({
    description: 'The wallet address of the user',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  mnemonic: string;

  @ApiProperty({
    description: 'The unique identifier of the user',
    type: 'string', // UUID should be treated as a string in Swagger
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;
}
