import { IsInt, IsNotEmpty, Min } from 'class-validator';  

export class ProductRequestDto {
    @IsInt()
    @Min(1)
    id: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}
