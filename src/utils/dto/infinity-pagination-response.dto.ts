import { Type } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class InfinityPaginationResponseDto<T> {
  data: T[];
  hasNextPage: boolean;
  page: number;
  totalPage: number;
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiResponseProperty({ type: [classReference] })
    data!: T[];

    @ApiResponseProperty({
      type: Boolean,
      example: true,
    })
    hasNextPage: boolean;

    @ApiResponseProperty({
      type: Number,
      example: 2,
    })
    page: number;

    @ApiResponseProperty({
      type: Number,
      example: 2,
    })
    totalPage: number;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}

export function InfinityPaginationEmpty<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiResponseProperty({ type: classReference, example: [] })
    data!: T[];

    @ApiResponseProperty({
      type: Boolean,
      example: false,
    })
    hasNextPage: boolean;

    @ApiResponseProperty({
      type: Number,
      example: 1,
    })
    page: number;

    @ApiResponseProperty({
      type: Number,
      example: 0,
    })
    totalPage: number;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}Empty`,
  });

  return Pagination;
}
