import { IsNotEmpty, Min, IsInt } from 'class-validator';

export class ProductQtyDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}
