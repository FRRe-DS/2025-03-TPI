import {HttpException, HttpStatus} from '@nestjs/common';

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized Access') {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

