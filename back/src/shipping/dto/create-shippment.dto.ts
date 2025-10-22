import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductQtyDto } from './product-qty.dto';
import { TransportMethods } from 'src/shared/enums/transport-methods.enum';

export class CreateShippmentDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    order_id: number;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    delivery_address: AddressDto;

    @IsEnum(TransportMethods)
    @IsNotEmpty()
    transport_type: TransportMethods;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductQtyDto)
    products: ProductQtyDto[];
}