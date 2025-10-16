import {HttpException, HttpStatus} from '@nestjs/common';

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized Access', details?: any) {
        super(
            { code: 'unauthorized_access',
            message, 
            details },
            HttpStatus.UNAUTHORIZED);
    }
}

