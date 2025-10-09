import {ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductRequestDto } from './product-request.dto';

export class CostCalculationRequestDto {
    //delivery address
    @ValidateNested()
    @Type(() => AddressDto)
    deliveryAddress: AddressDto;

    //products
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];
}