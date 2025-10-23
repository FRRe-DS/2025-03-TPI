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

  @IsNumber()
  @IsNotEmpty()
  shipping_id: number;

  
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  status: ShippingStatus;


  @IsEnum(TransportMethods)
  @IsNotEmpty()
  transport_type: TransportMethods;


  @IsDateString()
  @IsNotEmpty()
  estimated_delivery_at: string;
}
