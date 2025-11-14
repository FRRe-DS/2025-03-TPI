import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsEnum, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductQtyDto } from './product-qty.dto';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

export class CreateShippmentRequestDto {
    @IsNumber({}, { message: 'The field "user_id" must be a number' })
    @IsNotEmpty({ message: 'The field "user_id" cannot be empty' })
    user_id: number;

    @IsNumber({}, { message: 'The field "order_id" must be a number' })
    @IsNotEmpty({ message: 'The field "order_id" cannot be empty' })
    order_id: number;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty({ message: 'The field "delivery_address" cannot be empty' })
    delivery_address: AddressDto;

    @IsEnum(TransportMethods, { message: 'The field "transport_type" must be a valid value from the following: ' + Object.values(TransportMethods).join(', ') })
    @IsNotEmpty({ message: 'The field "transport_type" cannot be empty' })
    transport_type: TransportMethods;

    @IsArray({ message: 'The field "products" must be an array' })
    @ArrayNotEmpty({ message: 'The field "products" cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => ProductQtyDto)
    products: ProductQtyDto[];
}