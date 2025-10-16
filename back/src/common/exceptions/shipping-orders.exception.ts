import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingOrdersException extends HttpException {
    constructor(message: string = 'Invalid Shipping Order', details?: any) {
        super(
            { code: 'invalid_shipping_order',
            message, 
            details },
            HttpStatus.BAD_REQUEST);
    }
}
