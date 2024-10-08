import { TransactionDomain } from '../../../../domain/transaction';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  public static toDomain(entity: TransactionEntity): TransactionDomain {
    const domain = new TransactionDomain();
    domain.id = entity.id;
    domain.txHash = entity.txHash;
    domain.currency = entity.currency;
    domain.type = entity.type;
    domain.fromAddress = entity.fromAddress;
    domain.contractAddress = entity.contractAddress;
    domain.data = entity.data;
    domain.errorMessage = entity.errorMessage;
    domain.status = entity.status;
    domain.unsignedtxHash = entity.unsignedtxHash;
    domain.blockNumber = entity.blockNumber;
    domain.blockHash = entity.blockHash;
    domain.blockTimestamp = entity.blockTimestamp;
    domain.feeAmount = entity.feeAmount;
    domain.unsignedRaw = entity.unsignedRaw;
    domain.signedRaw = entity.signedRaw;
    return domain;
  }

  public static toEntity(domain: TransactionDomain): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = domain.id;
    entity.txHash = domain.txHash;
    entity.currency = domain.currency;
    entity.type = domain.type;
    entity.fromAddress = domain.fromAddress;
    entity.contractAddress = domain.contractAddress;
    entity.data = domain.data;
    entity.errorMessage = domain.errorMessage;
    entity.status = domain.status;
    entity.unsignedtxHash = domain.unsignedtxHash;
    entity.blockNumber = domain.blockNumber;
    entity.blockHash = domain.blockHash;
    entity.blockTimestamp = domain.blockTimestamp;
    entity.feeAmount = domain.feeAmount;
    entity.unsignedRaw = domain.unsignedRaw;
    entity.signedRaw = domain.signedRaw;
    return entity;
  }
}
