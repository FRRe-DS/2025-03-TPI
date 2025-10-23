import { HttpStatus, HttpException } from "@nestjs/common";

export class BusinessRuleViolationException extends HttpException {
    constructor(message: string = 'Business Rule Violation', details?: any) {
        const response: any = {
            code: 'business_rule_violation',
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
