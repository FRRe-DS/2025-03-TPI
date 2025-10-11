import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingIdNotFoundException extends HttpException {
    constructor(message: string = 'Shipping ID Not Found') {
        super(message, HttpStatus.NOT_FOUND);
    }
}
