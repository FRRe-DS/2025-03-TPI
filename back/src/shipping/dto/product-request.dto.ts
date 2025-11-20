import { IsInt, IsNotEmpty, Min } from 'class-validator';  

export class ProductRequestDto {
    @IsInt({ message: 'The field "id" must be an integer' })
    @Min(1, { message: 'The field "id" must be at least 1' })
    id: number;

    @IsInt({ message: 'The field "quantity" must be an integer' })
    @Min(1, { message: 'The field "quantity" must be at least 1' })
    @IsNotEmpty({ message: 'The field "quantity" cannot be empty' })
    quantity: number;
}
