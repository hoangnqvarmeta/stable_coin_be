---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
---
import { Injectable } from '@nestjs/common';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Query<%= name %>Dto } from './dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { <%= name %>Repository } from './infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { infinityPagination } from '../utils/infinity-pagination';

@Injectable()
export class <%= h.inflection.transform(name, ['pluralize']) %>Service {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  create(create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.create(create<%= name %>Dto);
  }

  async findAllWithPagination(query: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto) {
    const [data, count] = await this.<%= h.inflection.camelize(name, true) %>Repository.findAllWithPagination(query);
    return infinityPagination(
      data,
      { page: query.page, limit: query.limit },
      Math.ceil(count / query.limit),
    );
  }

  findOne(fields: FindOptionsWhere<<%= name %>>) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findOne(fields);
  }

  findMany(options: FindManyOptions<<%= name %>>) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findMany(options);
  }

  findById(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
  }

  update(id: <%= name %>['id'], update<%= name %>Dto: Update<%= name %>Dto) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.update(id, update<%= name %>Dto);
  }

  remove(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.remove(id);
  }
}
