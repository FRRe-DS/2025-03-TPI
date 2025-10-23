import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'internal_server_error';
    let message = 'Internal server error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        
        // Usar el formato de tus excepciones personalizadas
        code = responseObj.code || this.getDefaultCodeFromStatus(status);
        message = responseObj.message || exception.message;
        details = responseObj.details;
      } else {
        message = exceptionResponse as string;
        code = this.getDefaultCodeFromStatus(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'internal_server_error';
    }

    // Formato de error estandarizado
    const errorResponse: {
      code: string;
      message: string;
      details?: any;
    } = {
      code,
      message,
    };

    // Solo incluir details si existe
    if (details !== undefined) {
      errorResponse.details = details;
    }

    response.status(status).json(errorResponse);
  }

  private getDefaultCodeFromStatus(status: number): string {
    const codeMap: { [key: number]: string } = {
      400: 'bad_request',
      401: 'unauthorized',
      403: 'forbidden',
      404: 'not_found',
      409: 'conflict',
      422: 'unprocessable_entity',
      500: 'internal_server_error',
    };

    return codeMap[status] || 'unknown_error';
  }
}