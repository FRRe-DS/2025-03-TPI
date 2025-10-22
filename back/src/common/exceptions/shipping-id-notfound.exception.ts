import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingIdNotFoundException extends HttpException {
    constructor(message: string = 'Shipping ID Not Found', details?: any) {
        super(
            { code: 'shipping_id_not_found',
            message, 
            details },
            HttpStatus.NOT_FOUND);
    }
}
