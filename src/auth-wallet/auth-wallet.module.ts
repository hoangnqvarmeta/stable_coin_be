import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthWalletService } from './auth-wallet.service';
import { AuthWalletController } from './auth-wallet.controller';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthWalletService],
  exports: [AuthWalletService],
  controllers: [AuthWalletController],
})
export class AuthWalletModule {}
