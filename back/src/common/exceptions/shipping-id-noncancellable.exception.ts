import {HttpStatus, HttpException} from '@nestjs/common';

export class ShippingIdNonCancellableException extends HttpException {
    constructor(message: string = 'Shipping ID is already on the way and cannot be cancelled', details?: any) {
        const response: any = {
            code: 'shipping_id_non_cancellable',
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
