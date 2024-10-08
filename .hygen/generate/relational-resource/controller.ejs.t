---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto } from './dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { ApiCreateResponse } from '../utils/swagger/ApiCreateResponse';
import { ApiDeleteResponse } from '../utils/swagger/ApiDeleteResponse';
import { ApiGetDetailResponse } from '../utils/swagger/ApiGetDetailResponse';
import { ApiPaginatedResponse } from '../utils/swagger/ApiPaginatedResponse';
import { ApiUpdateResponse } from '../utils/swagger/ApiUpdateResponse';

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service: <%= h.inflection.transform(name, ['pluralize']) %>Service) {}

  @Post()
  @ApiCreateResponse(<%= name %>, 'Create a new <%= name %>.')
  create(@Body() create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.create(create<%= name %>Dto);
  }

  @Get()
  @ApiPaginatedResponse(<%= name %>, 'Retrieved paginated <%= name %> data.')
  async findAll(
    @Query() query: Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto,
  ): Promise<InfinityPaginationResponseDto<<%= name %>>> {
    query.page = query?.page ?? 1;
    query.limit = query.limit ?? 10;
    if (query.limit > 50) {
      query.limit = 50;
    }

    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findAllWithPagination(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiGetDetailResponse(<%= name %>)
  @ApiOkResponse({
    type: <%= name %>,
  })
  findOne(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findById(id);
  }

  @Patch(':id')
  @ApiUpdateResponse(<%= name %>)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  update(
    @Param('id') id: string,
    @Body() update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.update(id, update<%= name %>Dto);
  }

  @Delete(':id')
  @ApiDeleteResponse()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.remove(id);
  }
}
