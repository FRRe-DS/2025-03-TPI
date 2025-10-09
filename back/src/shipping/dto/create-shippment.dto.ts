import { IsNumber, ValidateNested, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductRequestDto } from './product-request.dto';
import { TransportDto } from './transport.dto';


export class CreateShipmentDto {

    @IsNumber() @Max(1)
    orderId: number;

    @IsNumber() @Max(1)
    userId: number;

    @ValidateNested()
    @Type(() => AddressDto)
    deliveryAddress: AddressDto;

    @ValidateNested()
    @Type(() => TransportDto)
    transport: TransportDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];


}