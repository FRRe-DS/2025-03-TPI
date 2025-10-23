import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized Access', details?: any) {
    const response: any = {
      code: 'unauthorized_access',
      message,
    };

    if (details !== undefined) {
      response.details = details;
    }

    super(
      response,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
