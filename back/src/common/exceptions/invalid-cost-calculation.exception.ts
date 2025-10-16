import { HttpStatus, HttpException} from '@nestjs/common';

export class InvalidCostCalculationException extends HttpException {    
    constructor(message: string = 'Invalid Cost Calculation', details?: any) {
        super(
            { code: 'invalid_cost_calculation',
            message,
            details }, 
            HttpStatus.BAD_REQUEST);
    }
}
    