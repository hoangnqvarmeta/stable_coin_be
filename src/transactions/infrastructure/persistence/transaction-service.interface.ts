// src/event-services/event-service.interface.ts
export interface TransactionServiceInterface {
  getEventsFromContract(
    eventName: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<any[]>;

  getTransactionData(txHash: string): Promise<any>;

  getCurrentBlockNumber(): Promise<number>;
}
