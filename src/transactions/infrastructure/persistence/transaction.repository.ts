import { DeepPartial } from '@/utils/types/deep-partial.type';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { TransactionEntity } from './relational/entities/transaction.entity';
import { TransactionDomain } from '../../domain/transaction';
import { EntityCondition } from '../../../utils/types/entity-condition.type';

export abstract class TransactionRepository {
  abstract create(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionEntity>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[TransactionEntity[], number]>;

  abstract findById(
    id: TransactionEntity['id'],
  ): Promise<NullableType<TransactionEntity>>;

  abstract findOne(
    fields: EntityCondition<TransactionDomain>,
  ): Promise<NullableType<TransactionDomain>>;

  abstract update(
    id: TransactionEntity['id'],
    payload: DeepPartial<TransactionEntity>,
  ): Promise<TransactionEntity | null>;

  abstract remove(id: TransactionEntity['id']): Promise<void>;
}
