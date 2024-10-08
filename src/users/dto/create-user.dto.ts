import {
  // decorators here

  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: '0x0000000000000000000000000000000000000000',
  })
  @IsString()
  publicAddress: string;
  @ApiProperty({
    type: String,
    example: '0x0000000000000000000000000000000000000000',
  })
  @IsString()
  privateAddress: string;
  @ApiProperty({
    type: String,
    example: '0x0000000000000000000000000000000000000000',
  })
  @IsString()
  mnemonic: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
