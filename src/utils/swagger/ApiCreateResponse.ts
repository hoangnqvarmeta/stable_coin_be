import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponse } from '../response';
import { ExampleOptions } from './ApiPaginatedResponse';

/**
 * Custom decorator for Create API responses.
 * @param model - The model class to be used in the successful creation response.
 * @param description - A brief description of the API endpoint.
 */
export function ApiCreateResponse(
  model: Type<any>,
  description: string = `Create ${model.name}`,
  examples?: ExampleOptions,
) {
  return applyDecorators(
    ApiOperation({ summary: description }), // Add a summary for the API
    ApiCreatedResponse({
      type: model,
      description: 'Successfully created a new resource.',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Client error due to invalid request parameters.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            invalidData: {
              summary: 'Invalid data provided',
              description: 'The data provided for user creation is invalid.',
              value: {
                message: 'Invalid data',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
          },
        },
      },
    }),
    ApiConflictResponse({
      status: HttpStatus.CONFLICT,
      description: 'Conflict due to existing unique or primary value.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            ...examples?.conflictExamples,
          },
        },
      },
    }),
    HttpCode(HttpStatus.CREATED),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Server error occurred while processing the request.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            internalServerError: {
              summary: 'An internal server error occurred',
              value: {
                message: 'Server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          },
        },
      },
    }),
  );
}
