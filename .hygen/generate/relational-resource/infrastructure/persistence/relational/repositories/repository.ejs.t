---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository.ts
---
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
import { <%= name %> } from '../../../../domain/<%= name %>';
import { <%= name %>Entity } from '../entities/<%= name %>.entity';
import { <%= name %>Mapper } from '../mappers/<%= name %>.mapper';
import { Query<%= name %>Dto } from '../../../../dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { getStartDateForQuicktimeFilter } from '@/utils/enums/quickTimeFilter.dto';

export type Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Options = {
  unAuth: boolean;
}

export abstract class <%= name %>Repository {
  abstract create(
    data: Omit<<%= name %>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<<%= name %>>;

  abstract findAllWithPagination(
    query: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto,
    options?: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Options
  ): Promise<[<%= name %>[], count: number]>;

  abstract findById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>>;
  abstract findOne(
    fields: FindOptionsWhere<<%= name %>>
  ): Promise<NullableType<<%= name %>>>;

  abstract findMany(options: FindManyOptions<<%= name %>>): Promise<<%= name %>[]>
  abstract update(
    id: <%= name %>['id'],
    payload: DeepPartial<<%= name %>>,
  ): Promise<<%= name %> | null>;

  abstract remove(id: <%= name %>['id']): Promise<void>;
}


@Injectable()
export class <%= name %>RelationalRepository implements <%= name %>Repository {
  constructor(
    @InjectRepository(<%= name %>Entity)
    private readonly <%= h.inflection.camelize(name, true) %>Repository: Repository<<%= name %>Entity>,
  ) {}

  async create(data: <%= name %>): Promise<<%= name %>> {
    const persistenceModel = <%= name %>Mapper.toPersistence(data);
    const newEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(persistenceModel),
    );
    return <%= name %>Mapper.toDomain(newEntity);
  }

  async findAllWithPagination(
    query: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto,
    options?: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Options
    ): Promise<[<%= name %>[], count: number]>{
    const queryBuilder = this.<%= h.inflection.camelize(name, true) %>Repository.createQueryBuilder('<%= h.inflection.transform(name, ['underscore']) %>');
    if(query.filters) {
      if (query.filters.time) { 
        const startDate = getStartDateForQuicktimeFilter(query.filters?.time);

        if (startDate) {
          queryBuilder.andWhere('nft_log.createdAt >= :startDate', {
            startDate,
          });
        }
      }
      if (query.filters.startDate) {
        queryBuilder.andWhere('<%= h.inflection.transform(name, ['underscore']) %>.createdAt >= :startDate', {
          startDate: query.filters.startDate.toISOString(),
        });
      }

      if (query.filters.endDate) {
        queryBuilder.andWhere('<%= h.inflection.transform(name, ['underscore']) %>.createdAt <= :endDate', {
          endDate: query.filters.endDate.toISOString(),
        });
      }

      if (query.filters.search) {
        const search = `%${query.filters.search.toLowerCase()}%`;
        queryBuilder.andWhere(
          new Brackets((qb) => { qb.orWhere(`<%= h.inflection.transform(name, ['underscore']) %>.name ILIKE :search`, { search })
          .orWhere(`<%= h.inflection.transform(name, ['underscore']) %>.id ILIKE :search`, { search }) }),
        );
      }
    }
    if (query.sorts?.length) {
      query.sorts.forEach((sortOption) => {
        queryBuilder.addOrderBy(
          `<%= h.inflection.transform(name, ['underscore']) %>.${sortOption.orderBy}`,
          sortOption.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      queryBuilder.addOrderBy('<%= h.inflection.transform(name, ['underscore']) %>.updatedAt', 'DESC');
    }

    if(options?.unAuth) {
    }
    const skip = (query.page - 1) * query.limit;
    queryBuilder.skip(skip).take(query.limit);

    const [entities, count] = await queryBuilder.getManyAndCount();
    return [entities.map((entity) => <%= name %>Mapper.toDomain(entity)), count];
  }

  async findById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    return entity ? <%= name %>Mapper.toDomain(entity) : null;
  }

  async findMany(options: FindManyOptions<<%= name %>>): Promise<<%= name %>[]> {
    const entities = await this.<%= h.inflection.camelize(name, true) %>Repository.find(options);

    return entities.map((e) => <%= name %>Mapper.toDomain(e));
  }

  async findOne(fields: FindOptionsWhere<<%= name %>>): Promise<NullableType<<%= name %>>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: fields as FindOptionsWhere<<%= name %>Entity>,
    });

    return entity ? <%= name %>Mapper.toDomain(entity) : null;
  }

  async update(
    id: <%= name %>['id'],
    payload: Partial<<%= name %>>,
  ): Promise<<%= name %>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(
        <%= name %>Mapper.toPersistence({
          ...<%= name %>Mapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return <%= name %>Mapper.toDomain(updatedEntity);
  }

  async remove(id: <%= name %>['id']): Promise<void> {
    await this.<%= h.inflection.camelize(name, true) %>Repository.delete(id);
  }
}
