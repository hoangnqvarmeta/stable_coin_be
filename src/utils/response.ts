import { ApiProperty } from '@nestjs/swagger';
import { ResponseArrayData } from './dto/response-array-data.dto';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class ErrorResponse {
  @ApiProperty({
    description: 'Error message explaining the reason for the failure',
    example: 'Invalid request data',
  })
  message?: string;

  @ApiProperty({
    description: 'HTTP status code associated with the error',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Optional additional error details',
    example: 'errorCode',
    required: false,
  })
  code: string;
}

export const responseArrayData = <T>(data: T): ResponseArrayData<T> => {
  return {
    data,
  };
};

export class BaseResponse {
  @ApiProperty({ type: String, example: 'OK' })
  message: string;

  @ApiProperty({ type: Number, example: 200 })
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }

  send() {
    return this;
  }
}

export class OK extends BaseResponse {
  constructor(message: string = 'OK') {
    super(message, 200);
  }
}

export class Created extends BaseResponse {
  constructor(message: string = 'Created') {
    super(message, 201);
  }
}

export class BadRequest extends BadRequestException {
  constructor(message?: string | object | any, error = 'Bad Request') {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error,
        message: message || 'Bad Request',
      },
      error,
    );
  }
}

export class NotFoundRequest extends NotFoundException {
  constructor(message?: string | object | any, error = 'recordNotFound') {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error,
        message: message || 'recordNotFound',
      },
      error,
    );
  }
}

export class UnprocessableEntityRequest extends UnprocessableEntityException {
  constructor(
    message?: string | object | any,
    error = 'unprocessableEntityException',
  ) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error,
        message: message || 'unprocessableEntityException',
      },
      error,
    );
  }
}
