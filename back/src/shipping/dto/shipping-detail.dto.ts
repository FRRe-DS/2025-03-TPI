import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { AddressDto } from "./address.dto";
import { ProductRequestDto } from "./product-request.dto";
import { ShippingStatus } from "../../shared/enums/shipping-status.enum";
import { TransportDto } from "./transport.dto";
import { ShippingLogDto } from "./shipping-log.dto";


export class ShippingDetailsResponseDto {
    @IsNumber() 
    @Min(1)
    @IsNotEmpty()
    shipping_id: number;

    @IsNumber() 
    @Min(1)
    @IsNotEmpty()
    order_id: number;

    @IsNumber() 
    @Min(1)
    @IsNotEmpty()
    user_id: number;

    @ValidateNested()
    @Type(() => AddressDto)
    deliveryAddress: AddressDto;

    @ValidateNested()
    @Type(() => AddressDto)
    departureAddress: AddressDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];

    //shipping status
    @ValidateNested()
    shippingStatus: ShippingStatus;

    @ValidateNested()
    @Type(() => TransportDto)
    transport_type: TransportDto;

    @IsNotEmpty()
    estimated_delivery_at: string;

    @IsNotEmpty()
    created_at: string;

    @IsNotEmpty()
    updated_at: string;

    @IsArray()
    @IsNotEmpty()
    logs: ShippingLogDto[];

}