import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingIdNotFoundException extends HttpException {
    constructor(message: string = 'Shipping ID Not Found', details?: any) {
        const response: any = {
            code: 'shipping_id_not_found',
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
