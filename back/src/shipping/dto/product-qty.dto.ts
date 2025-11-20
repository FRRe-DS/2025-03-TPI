import { IsNotEmpty, Min, IsInt } from 'class-validator';

export class ProductQtyDto {
    @IsInt({message: 'The field "id" must be an integer' })
    @IsNotEmpty({message: 'The field "id" cannot be empty' })
    id: number;

    @IsInt({message: 'The field "quantity" must be an integer' })
    @Min(1, {message: 'The field "quantity" must be at least 1' })
    @IsNotEmpty({message: 'The field "quantity" cannot be empty' })
    quantity: number;
}
