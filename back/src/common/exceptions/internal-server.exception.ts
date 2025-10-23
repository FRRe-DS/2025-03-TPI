import {HttpException, HttpStatus} from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal Server Error', details?: any) {
        const response: any = {
            code: 'internal_server_error',
            message,
        };
        if (details !== undefined) {
            response.details = details;
        }

        super(
            response,
             HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    