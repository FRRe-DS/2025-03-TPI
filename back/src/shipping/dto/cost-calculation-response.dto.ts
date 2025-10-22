import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductRequestDto } from './product-request.dto';
import { TransportDto } from './transport.dto';

export class CostCalculationResponseDto {
    //delivery address
    @IsNotEmpty()
    @IsString()
    currency: string;

    //products
    @IsNotEmpty()
    @IsNumber()
    totalCost: number;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => TransportDto)
    transportMethod: TransportDto;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];

    //estimated delivery date

    //direction
}