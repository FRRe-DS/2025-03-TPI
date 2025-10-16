import {HttpStatus, HttpException} from '@nestjs/common';

export class ShippingIdNonCancellableException extends HttpException {
    constructor(message: string = 'Shipping ID is already on the way and cannot be cancelled', details?: any) {
        super(
            { code: 'shipping_id_non_cancellable',
            message, 
            details },
            HttpStatus.BAD_REQUEST);
    }
}
