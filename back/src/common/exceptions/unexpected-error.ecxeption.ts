import { HttpException, HttpStatus } from "@nestjs/common";

export class UnexpectedErrorException extends HttpException {
    constructor(message: string = 'Unexpected Error', details?: any) {
        super(
            { code: 'unexpected_error',
            message, 
            details },
            HttpStatus.INTERNAL_SERVER_ERROR);
    }
}