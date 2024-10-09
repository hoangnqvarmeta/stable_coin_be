import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { User } from '../domain/user';

export class FilterUserDto {
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
  @IsDate({ message: 'startDateNotValid' })
  startDate?: Date | null;

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
  })
  @IsDate({ message: 'endDateNotValid' })
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
export class SortUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof User;

  @ApiProperty({ type: String, example: 'asc' })
  @IsString()
  order: string;
}

export class QueryUserDto {
  @ApiPropertyOptional({
    default: 1,
    description: 'Current Page',
    format: 'int32',
    minimum: 1,
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
    minimum: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Min(1, { message: 'pageNotValid' })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    type: String,
    example: '{"search":"0x1"}',
    format: 'json',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto | null;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: '{"wallet_address":"asc"}',
    format: 'json',
  })
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sorts?: SortUserDto[];
}
