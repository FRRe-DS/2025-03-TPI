import { HttpStatus, HttpException} from '@nestjs/common';

export class InvalidCostCalculationException extends HttpException {    
    constructor(message: string = 'Invalid Cost Calculation', details?: any) {
        const response: any = {
            code: 'invalid_cost_calculation',
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
    