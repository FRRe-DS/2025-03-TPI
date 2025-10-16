import {HttpException, HttpStatus} from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal Server Error', details?: any) {
        super(
            { code: 'internal_server_error',
            message,
            details },
             HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    