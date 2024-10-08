// src/event-services/event-service.factory.ts
import { Injectable } from '@nestjs/common';
import { TransactionServiceInterface } from './transaction-service.interface';
import { EthereumEventService } from '../ethers/ethers-event.service';

@Injectable()
export class TransactionServiceFactory {
  constructor(private readonly ethereumEventService: EthereumEventService) {}

  createEventService(networkType: string): TransactionServiceInterface {
    switch (networkType) {
      default:
        return this.ethereumEventService;
    }
  }
}
