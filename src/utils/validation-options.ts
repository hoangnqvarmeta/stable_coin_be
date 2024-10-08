import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export function generateErrors(errors: ValidationError[]) {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

function generateErrorsMessage(errors: ValidationError[]): string {
  return errors.map((error) => {
    const constraints = Object.values(error.constraints ?? {});
    if (constraints.length > 0) {
      return `${constraints.join(', ')}`;
    } else {
      return generateErrors(error.children ?? []);
    }
  })[0];
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      message: generateErrorsMessage(errors),
    });
  },
};

export default validationOptions;
