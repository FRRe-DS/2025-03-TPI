import {HttpException, HttpStatus} from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal Server Error') {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    