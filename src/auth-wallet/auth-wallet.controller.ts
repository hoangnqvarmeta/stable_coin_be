import {
  Body,
  Controller,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { ApiCreateResponse } from '../utils/swagger/ApiCreateResponse';
import { AuthWalletLoginDto } from './dto/auth-wallet-login.dto';
@ApiTags('Auth')
@Controller({
  path: 'auth/wallet',
  version: '1',
})
export class AuthWalletController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @ApiCreateResponse(LoginResponseDto, 'User logged in with wallet', {
    badRequestExamples: {
      addressNotMatch: {
        summary: 'Address not match',
        description: 'Address not match',
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'addressNotMatch',
          message: 'Address not match',
        },
      },
    },
  })
  Metamasklogin(
    @Body() loginDto: AuthWalletLoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.validateWalletLogin(loginDto);
  }
}
