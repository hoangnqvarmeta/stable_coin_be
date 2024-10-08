import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export interface IPaginationOptions {
  page: number;
  limit: number;
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
