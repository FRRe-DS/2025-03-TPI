import {HttpStatus, HttpException} from '@nestjs/common';

export class ShippingIdNonCancellableException extends HttpException {
    constructor(message: string = 'Shipping ID is already on the way and cannot be cancelled') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
