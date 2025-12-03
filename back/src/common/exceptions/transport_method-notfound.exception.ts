import { HttpException, HttpStatus } from '@nestjs/common';

export class TransportMethodNotFoundException extends HttpException {
    constructor(message: string = 'Transport Method Not Found', details?: any) {
        const response: any = {
            code: 'transport_method_not_found',
            message,
        };

        if (details !== undefined) {
            response.details = details;
        }

        super(
            response,
            HttpStatus.NOT_FOUND);
    }
}