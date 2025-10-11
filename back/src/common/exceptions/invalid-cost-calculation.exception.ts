import { HttpStatus, HttpException} from '@nestjs/common';

export class InvalidCostCalculationException extends HttpException {    
    constructor(message: string = 'Invalid Cost Calculation') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
