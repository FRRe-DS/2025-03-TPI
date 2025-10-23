import { HttpException, HttpStatus } from "@nestjs/common";

export class UnexpectedErrorException extends HttpException {
    constructor(message: string = 'Unexpected Error', details?: any) {
        const response: any = {
            code: 'unexpected_error',
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
