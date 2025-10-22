import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class ProductQtyDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}
