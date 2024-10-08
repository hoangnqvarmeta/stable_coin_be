import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TransactionRepository } from '../../transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { TransactionDomain } from '../../../../domain/transaction';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}
  async findOne(
    fields: EntityCondition<TransactionDomain>,
  ): Promise<NullableType<TransactionDomain>> {
    const entity = await this.transactionRepository.findOne({
      where: fields as FindOptionsWhere<TransactionEntity>,
    });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async create(data: TransactionEntity): Promise<TransactionEntity> {
    const newEntity = await this.transactionRepository.save(
      this.transactionRepository.create(data),
    );
    return newEntity;
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[TransactionEntity[], number]> {
    const [entities, count] = await this.transactionRepository
      .createQueryBuilder('transaction')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [entities, count];
  }

  async findById(
    id: TransactionEntity['id'],
  ): Promise<NullableType<TransactionEntity>> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
    });

    return entity || null;
  }

  async update(
    id: TransactionEntity['id'],
    payload: Partial<TransactionEntity>,
  ): Promise<TransactionEntity> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.transactionRepository.save(
      this.transactionRepository.create({ ...entity, ...payload }),
    );

    return updatedEntity;
  }

  async remove(id: TransactionEntity['id']): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
