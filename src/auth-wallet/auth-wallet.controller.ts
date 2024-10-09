import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
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
  Metamasklogin(
    @Body() loginDto: AuthWalletLoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.validateWalletLogin(loginDto);
  }
}
