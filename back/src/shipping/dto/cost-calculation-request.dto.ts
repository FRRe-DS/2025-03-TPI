import {ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductRequestDto } from './product-request.dto';

export class CostCalculationRequestDto {
    //delivery address
    @IsNotEmpty({message: 'The field "delivery_address" cannot be empty' })
    @ValidateNested()
    @Type(() => AddressDto)
    delivery_address: AddressDto;

    //products
    @IsArray({ message: 'The field "products" must be an array' })
    @ArrayNotEmpty({ message: 'The field "products" cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];
}