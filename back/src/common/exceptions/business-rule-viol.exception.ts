import { HttpStatus, HttpException } from "@nestjs/common";

export class BusinessRuleViolationException extends HttpException {
    constructor(message: string = 'Business Rule Violation', details?: any) {
        super(
            { code: 'business_rule_violation',
            message, 
            details },
            HttpStatus.BAD_REQUEST);
    }
}
