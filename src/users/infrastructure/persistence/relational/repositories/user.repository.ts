import { DeepPartial } from '@/utils/types/deep-partial.type';
import { NullableType } from '@/utils/types/nullable.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { QueryUserDto } from '../../../../dto/query-user.dto';
import { getStartDateForQuicktimeFilter } from '@/utils/enums/quickTimeFilter.dto';

export type QueryUserOptions = {
  unAuth: boolean;
};

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ): Promise<User>;

  abstract findAllWithPagination(
    query: QueryUserDto,
    options?: QueryUserOptions,
  ): Promise<[User[], count: number]>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;
  abstract findOne(fields: FindOptionsWhere<User>): Promise<NullableType<User>>;

  abstract findMany(options: FindManyOptions<User>): Promise<User[]>;
  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;
}

@Injectable()
export class UserRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.userRepository.save(
      this.userRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findAllWithPagination(
    query: QueryUserDto,
    options?: QueryUserOptions,
  ): Promise<[User[], count: number]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (query.filters) {
      if (query.filters.time) {
        const startDate = getStartDateForQuicktimeFilter(query.filters?.time);

        if (startDate) {
          queryBuilder.andWhere('nft_log.createdAt >= :startDate', {
            startDate,
          });
        }
      }
      if (query.filters.startDate) {
        queryBuilder.andWhere('user.createdAt >= :startDate', {
          startDate: query.filters.startDate.toISOString(),
        });
      }

      if (query.filters.endDate) {
        queryBuilder.andWhere('user.createdAt <= :endDate', {
          endDate: query.filters.endDate.toISOString(),
        });
      }

      if (query.filters.search) {
        const search = `%${query.filters.search.toLowerCase()}%`;
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere(`user.name ILIKE :search`, { search }).orWhere(
              `user.id ILIKE :search`,
              { search },
            );
          }),
        );
      }
    }
    if (query.sorts?.length) {
      query.sorts.forEach((sortOption) => {
        queryBuilder.addOrderBy(
          `user.${sortOption.orderBy}`,
          sortOption.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      queryBuilder.addOrderBy('user.updatedAt', 'DESC');
    }

    if (options?.unAuth) {
    }
    const skip = (query.page - 1) * query.limit;
    queryBuilder.skip(skip).take(query.limit);

    const [entities, count] = await queryBuilder.getManyAndCount();
    return [entities.map((entity) => UserMapper.toDomain(entity)), count];
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findMany(options: FindManyOptions<User>): Promise<User[]> {
    const entities = await this.userRepository.find(
      options as FindManyOptions<UserEntity>,
    );

    return entities.map((e) => UserMapper.toDomain(e));
  }

  async findOne(fields: FindOptionsWhere<User>): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.userRepository.save(
      this.userRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.delete(id);
  }
}
