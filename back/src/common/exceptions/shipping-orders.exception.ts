import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingOrdersException extends HttpException {
    constructor(message: string = 'Invalid Shipping Order') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
