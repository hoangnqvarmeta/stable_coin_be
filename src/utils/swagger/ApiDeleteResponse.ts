import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponse } from '../response';

/**
 * Custom decorator for Delete API responses.
 * @param description - A brief description of the API endpoint.
 */
export function ApiDeleteResponse(description: string = 'Delete resource') {
  return applyDecorators(
    ApiOperation({ summary: description }), // Add a summary for the API
    ApiOkResponse({
      description: 'Successfully deleted the resource.',
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
                code: `ResourceNotFound`,
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
          },
        },
      },
    }),
    ApiConflictResponse({
      status: HttpStatus.CONFLICT,
      description: 'Conflict occurred (e.g., resource is in use).',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            resourceConflict: {
              summary: 'Conflict error',
              description: 'Resource is in use and cannot be deleted.',
              value: {
                message: 'Resource is in use, cannot delete.',
                code: 'resourceInUse',
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
