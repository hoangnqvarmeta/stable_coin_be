---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/relational-persistence.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= name %>Entity } from './entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { 
  <%= name %>RelationalRepository,
  <%= name %>Repository 
} from './repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';

@Module({
  imports: [TypeOrmModule.forFeature([<%= name %>Entity])],
  providers: [
    {
      provide: <%= name %>Repository,
      useClass: <%= name %>RelationalRepository,
    },
  ],
  exports: [<%= name %>Repository],
})
export class Relational<%= name %>PersistenceModule {}
