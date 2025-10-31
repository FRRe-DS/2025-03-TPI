import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsEnum, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ProductQtyDto } from './product-qty.dto';
import { TransportMethods } from 'src/shared/enums/transport-methods.enum';

export class CreateShippmentRequestDto {
    @IsNumber({}, { message: 'El campo "user_id" debe ser un número' })
    @IsNotEmpty({ message: 'El campo "user_id" no puede estar vacío' })
    user_id: number;

    @IsNumber({}, { message: 'El campo "order_id" debe ser un número' })
    @IsNotEmpty({ message: 'El campo "order_id" no puede estar vacío' })
    order_id: number;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty({ message: 'El campo "delivery_address" no puede estar vacío' })
    delivery_address: AddressDto;

    @IsEnum(TransportMethods, { message: 'El campo "transport_type" debe ser un valor válido de los siguientes: ' + Object.values(TransportMethods).join(', ') })
    @IsNotEmpty({ message: 'El campo "transport_type" no puede estar vacío' })
    transport_type: TransportMethods;

    @IsArray({ message: 'El campo "products" debe ser un arreglo' })
    @ArrayNotEmpty({ message: 'El campo "products" no puede estar vacío' })
    @ValidateNested({ each: true })
    @Type(() => ProductQtyDto)
    products: ProductQtyDto[];
}