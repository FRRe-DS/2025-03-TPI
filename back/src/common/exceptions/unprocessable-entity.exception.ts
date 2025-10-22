import { HttpStatus, HttpException} from '@nestjs/common';

export class UnprocessableEntityException extends HttpException {
    constructor(message: string = 'Unprocessable Entity', details?: any) {
        super(
            { code: 'unprocessable_entity',
            message, 
            details },
            HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
