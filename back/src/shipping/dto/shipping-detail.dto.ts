import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { AddressDto } from "./address.dto";
import { ProductRequestDto } from "./product-request.dto";
import { ShippingStatus } from "../../shared/enums/shipping-status.enum";
import { TransportDto } from "./transport.dto";
import { ShippingLogDto } from "./shipping-log.dto";


export class ShippingDetailsResponseDto {
    @IsNumber({}, { message: 'The field "shipping_id" must be a number' })
    @Min(1, { message: 'The field "shipping_id" must be at least 1' })
    @IsNotEmpty({ message: 'The field "shipping_id" cannot be empty' })
    shipping_id: number;

    @IsNumber({}, { message: 'The field "order_id" must be a number' })
    @Min(1, { message: 'The field "order_id" must be at least 1' })
    @IsNotEmpty({ message: 'The field "order_id" cannot be empty' })
    order_id: number;

    @IsNumber({}, { message: 'The field "user_id" must be a number' })
    @Min(1, { message: 'The field "user_id" must be at least 1' })
    @IsNotEmpty({ message: 'The field "user_id" cannot be empty' })
    user_id: number;

    @IsNotEmpty({ message: 'The field "delivery_Address" cannot be empty' })
    @ValidateNested()
    @Type(() => AddressDto)
    delivery_Address: AddressDto;

    @IsNotEmpty({ message: 'The field "departure_Address" cannot be empty' })
    @ValidateNested()
    @Type(() => AddressDto)
    departure_Address: AddressDto;

    @IsArray(  { message: 'The field "products" must be an array' })
    @ArrayNotEmpty({ message: 'The field "products" cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => ProductRequestDto)
    products: ProductRequestDto[];

    //shipping status
    @IsEnum(ShippingStatus, { message: 'The field "status" must be a valid value from the following: ' + Object.values(ShippingStatus).join(', ') })
    @IsNotEmpty({ message: 'The field "status" cannot be empty' })
    @ValidateNested()
    status: ShippingStatus;

    @IsNotEmpty({ message: 'The field "transport_type" cannot be empty' })
    @ValidateNested()
    @Type(() => TransportDto)
    transport_type: TransportDto;

    @IsString({ message: 'The field "tracking_number" must be a string' })
    @IsNotEmpty({ message: 'The field "tracking_number" cannot be empty' })
    tracking_number: string;

    @IsString({ message: 'The field "carrier_name" must be a string' })
    @IsNotEmpty({ message: 'The field "carrier_name" cannot be empty' })
    carrier_name: string;

    @IsNumber({}, { message: 'The field "total_cost" must be a number' })
    @IsNotEmpty({ message: 'The field "total_cost" cannot be empty' })
    total_cost: number;

    @IsString({ message: 'The field "currency" must be a string' })
    @IsNotEmpty({ message: 'The field "currency" cannot be empty' })
    currency: string;

    @IsDateString({}, { message: 'The field "estimated_delivery_at" must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'The field "estimated_delivery_at" cannot be empty' })
    estimated_delivery_at: string;

    @IsDateString({}, { message: 'The field "created_at" must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'The field "created_at" cannot be empty' })
    created_at: string;

    @IsDateString({}, { message: 'The field "updated_at" must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'The field "updated_at" cannot be empty' })
    updated_at: string;

    @IsArray( { message: 'The field "logs" must be an array' })
    @ValidateNested({ each: true })
    @Type(() => ShippingLogDto)
    @IsNotEmpty({ message: 'The field "logs" cannot be empty' })
    logs: ShippingLogDto[];

}