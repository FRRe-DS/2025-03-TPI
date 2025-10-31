import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

export class CreateShippingResponseDto {

  @IsNumber({}, { message: 'El campo "shipping_id" debe ser un número' })
  @IsNotEmpty({ message: 'El campo "shipping_id" no puede estar vacío' })
  shipping_id: number;

  
  @IsEnum(ShippingStatus, { message: 'El campo "status" debe ser un valor válido del enumerado ShippingStatus' })
  @IsNotEmpty({ message: 'El campo "status" no puede estar vacío' })
  status: ShippingStatus;


  @IsEnum(TransportMethods, { message: 'El campo "transport_type" debe ser un valor válido del enumerado TransportMethods' })
  @IsNotEmpty({ message: 'El campo "transport_type" no puede estar vacío' })
  transport_type: TransportMethods;


  @IsDateString({}, { message: 'El campo "estimated_delivery_at" debe ser una fecha válida' })
  @IsNotEmpty({ message: 'El campo "estimated_delivery_at" no puede estar vacío' })
  estimated_delivery_at: string;
}
