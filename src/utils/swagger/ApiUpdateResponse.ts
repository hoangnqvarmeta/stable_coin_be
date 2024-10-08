import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponse } from '../response';

/**
 * Custom decorator for Update API responses.
 * @param model - The model class to be used in the successful creation response.
 * @param description - A brief description of the API endpoint.
 */
export function ApiUpdateResponse(
  model: Type<any>,
  description: string = `Update ${model.name}`,
) {
  return applyDecorators(
    ApiOperation({ summary: description }), // Add a summary for the API
    ApiOkResponse({
      type: model,
      description: 'Successfully Updated a new resource.',
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
                code: 'invalidData',
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
            uniqueConstraintViolation: {
              summary: 'Unique constraint violation',
              description: 'Data already exists in the database.',
              value: {
                message: 'Data already exists',
                code: 'dataAlreadyExists',
                statusCode: HttpStatus.CONFLICT,
              },
            },
          },
        },
      },
    }),
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
                message: 'An internal server error occurred',
                code: 'internalServerError',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          },
        },
      },
    }),
  );
}
