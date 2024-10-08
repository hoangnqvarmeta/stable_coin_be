import {
  InfinityPaginationEmpty,
  InfinityPaginationResponse,
} from '@/utils/dto/infinity-pagination-response.dto';
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ErrorResponse } from '../response';

export type ExampleOptions = {
  badRequestExamples?: ExamplesObject;
  conflictExamples?: ExamplesObject;
};

/**
 * Custom decorator to standardize paginated API responses.
 * @param model - The model class to be used in the InfinityPaginationResponse.
 * @param description - A brief description of the API endpoint.
 */
export function ApiPaginatedResponse(
  model: Type<any>,
  description: string = `Get ${model.name} paginated`,
  examples?: ExampleOptions,
) {
  return applyDecorators(
    ApiOperation({ summary: description }), // Add a summary for the API
    ApiOkResponse({
      type: InfinityPaginationResponse(model),
      status: HttpStatus.OK,
      description: 'Successfully retrieved paginated data.',
    }),
    ApiNoContentResponse({
      type: InfinityPaginationEmpty(model),
      status: HttpStatus.NO_CONTENT,
      description: 'No data found.',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Client error due to invalid request parameters.',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponse) },
          examples: {
            pageSizeValid: {
              summary: 'Page size is invalid',
              description: 'The page size provided is not valid.',
              value: {
                code: 'invalidPageSize',
                message: '',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
            limitValid: {
              summary: 'Limit value is invalid',
              description:
                'The limit must not exceed the maximum allowed value.',
              value: {
                code: 'limitNotValid',
                message: '',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
            quicktimeFilterValid: {
              summary: 'Quicktime filter value is invalid',
              description: 'The quicktime filter must enum.',
              value: {
                code: 'quickTimeFilterNotValid',
                message: '',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
            startDateValid: {
              summary: 'Start date is invalid',
              description: 'The start date must be date.',
              value: {
                code: 'startDateNotValid',
                message: '',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
            endDateValid: {
              summary: 'End date is invalid',
              description: 'The end date must be a date after the start date.',
              value: {
                code: 'endDateNotValid',
                message: '',
                statusCode: HttpStatus.BAD_REQUEST,
              },
            },
            ...examples?.badRequestExamples,
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
                message: '',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          },
        },
      },
    }),
  );
}
