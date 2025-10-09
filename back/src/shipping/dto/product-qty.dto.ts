import { IsNotEmpty, IsNumber, Min} from "class-validator";

export class ProductQtyDto {

    @IsNotEmpty()
    productId: number;

    @IsNotEmpty()
    @IsNumber() 
    @Min(1)
    quantity: number;

}
