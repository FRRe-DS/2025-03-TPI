import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidShippingOrderException extends HttpException {
    constructor(message: string = 'Invalid Shipping Order', details?: any) {
        const response: any = {
            code: 'invalid_shipping_order',
            message,
        };

        if (details !== undefined) {
            response.details = details;
        }

        super(
            response,
            HttpStatus.BAD_REQUEST);
    }
}
