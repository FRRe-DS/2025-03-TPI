import {ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductRequestDto } from './product-request.dto';

export class CostCalculationRequestDto {
    //delivery address
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDto)
    delivery_address: AddressDto;

    //products
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];
}