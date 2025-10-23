import { HttpStatus, HttpException} from '@nestjs/common';

export class UnprocessableEntityException extends HttpException {
    constructor(message: string = 'Unprocessable Entity', details?: any) {
        const response: any = {
            code: 'unprocessable_entity',
            message,
        };

        if (details !== undefined) {
            response.details = details;
        }

        super(
            response,
            HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
