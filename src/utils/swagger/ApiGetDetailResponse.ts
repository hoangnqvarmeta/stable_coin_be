import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponse } from '../response';

/**
 * Custom decorator for Get Detail API responses.
 * @param model - The model class to be used in the successful response.
 * @param description - A brief description of the API endpoint.
 */
export function ApiGetDetailResponse(
  model: Type<any>,
  description: string = `Get ${model.name}`,
) {
  return applyDecorators(
    ApiOperation({ summary: description }), // Add a summary for the API
    ApiOkResponse({
      type: model,
      description: 'Successfully retrieved the resource.',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Client error due to invalid request parameters.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            idUuid: {
              summary: 'Invalid data provided',
              description: 'Id is not a valid UUID.',
              value: {
                code: 'invalidIdUuid',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Resource not found.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            resourceNotFound: {
              summary: 'Resource not found',
              description: 'The requested resource could not be found.',
              value: {
                code: `${model.name.toLocaleLowerCase()}NotFound`,
                statusCode: HttpStatus.NOT_FOUND,
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
