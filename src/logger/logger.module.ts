import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerConfiguration } from './logger.config';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      ...LoggerConfiguration(),
    }),
  ],
})
export class LoggerModule {}
