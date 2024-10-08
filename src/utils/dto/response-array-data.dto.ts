import { Type } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ResponseArrayData<T> {
  data: T;
}

export function ResponseArrayDataFC<T>(classReference: Type<T>) {
  abstract class Data {
    @ApiResponseProperty({ type: [classReference] })
    data!: T[];
  }

  Object.defineProperty(Data, 'name', {
    writable: false,
    value: `ResponseArrayData${classReference.name}ResponseDto`,
  });

  return Data;
}
