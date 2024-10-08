---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
---
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { <%= name %> } from '../domain/<%= name %>';
import { QuickTimeFilterEnum } from '../../utils/enums/quickTimeFilter.dto';

export class Filter<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto {
  @ApiPropertyOptional({
    type: QuickTimeFilterEnum,
    example: QuickTimeFilterEnum.last24hours,
  })
  @IsOptional()
  time?: QuickTimeFilterEnum;

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
  })
  @IsOptional()
  @Transform(
    ({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date; // Check for valid date
    },
    { toClassOnly: true },
  )
  startDate?: Date | null;

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
  })
  @IsOptional()
  @Transform(
    ({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date; // Check for valid date
    },
    { toClassOnly: true },
  )
  endDate?: Date | null;
  
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  search?: string | null;
}
export class Sort<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof <%= h.inflection.transform(name, ['singularize', 'classify']) %>;

  @ApiProperty({ type: String, example: 'asc' })
  @IsString()
  order: string;
}

export enum SortType<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto {
}

export class Query<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto {
  @ApiPropertyOptional({
    default: 1,
    description: 'Current Page',
    format: 'int32',
  })
  @Min(1, { message: 'pageNotValid' })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    default: 10,
    description: 'Page Size',
    format: 'int32',
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(Filter<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => Filter<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto)
  filters?: Filter<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto | null;

  @ApiPropertyOptional({
    type: 'enum',
    enum: SortType<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto,
  })
  @IsOptional()
  sort?: SortType<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(Sort<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => Sort<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto)
  sorts?: Sort<%= h.inflection.transform(name, ['singularize', 'classify']) %>Dto[];
}

