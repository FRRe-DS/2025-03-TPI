import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
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

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDto)
    delivery_Address: AddressDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDto)
    departure_Address: AddressDto;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];

    //shipping status
    @IsEnum(ShippingStatus)
    @ValidateNested()
    status: ShippingStatus;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => TransportDto)
    transport_type: TransportDto;

    @IsString()
    @IsNotEmpty()
    tracking_number: string;

    @IsString()
    @IsNotEmpty()
    carrier_name: string;

    @IsNumber()
    @IsNotEmpty()
    total_cost: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsDateString()
    @IsNotEmpty()
    estimated_delivery_at: string;

    @IsDateString()
    @IsNotEmpty()
    created_at: string;

    @IsDateString()
    @IsNotEmpty()
    updated_at: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShippingLogDto)
    @IsNotEmpty()
    logs: ShippingLogDto[];

}