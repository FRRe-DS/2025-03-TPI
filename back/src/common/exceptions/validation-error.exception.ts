import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationErrorException extends HttpException {
  constructor(message: string = 'Validation failed', details?: any) {
    const response: any = {
      code: 'validation_error',
      message,
    };

    if (details !== undefined) {
      response.details = details;
    }

    super(response, HttpStatus.BAD_REQUEST);
  }
}