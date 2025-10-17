import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductQtyDto } from './product-qty.dto';

export class CreateShippmentDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    originAddress: AddressDto;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    destinationAddress: AddressDto;

    @IsNumber()
    @IsNotEmpty()
    transportMethodId: number;

    @IsNumber()
    @IsOptional()
    totalCost?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductQtyDto)
    products: ProductQtyDto[];
}