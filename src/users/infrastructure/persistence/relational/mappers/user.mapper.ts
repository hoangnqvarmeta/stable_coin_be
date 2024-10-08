import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.publicAddress = raw.publicAddress;
    domainEntity.privateAddress = raw.privateAddress;
    domainEntity.mnemonic = raw.mnemonic;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();
    persistenceEntity.publicAddress = domainEntity.publicAddress;
    persistenceEntity.privateAddress = domainEntity.privateAddress;
    persistenceEntity.mnemonic = domainEntity.mnemonic;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.createdAt && domainEntity.updatedAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }
    return persistenceEntity;
  }
}
