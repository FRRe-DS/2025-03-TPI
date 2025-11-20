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

  @IsNumber({}, { message: 'The field "shipping_id" must be a number' })
  @IsNotEmpty({ message: 'The field "shipping_id" cannot be empty' })
  shipping_id: number;

  
  @IsEnum(ShippingStatus, { message: 'The field "status" must be a valid value from the ShippingStatus enum' })
  @IsNotEmpty({ message: 'The field "status" cannot be empty' })
  status: ShippingStatus;


  @IsEnum(TransportMethods, { message: 'The field "transport_type" must be a valid value from the TransportMethods enum' })
  @IsNotEmpty({ message: 'The field "transport_type" cannot be empty' })
  transport_type: TransportMethods;


  @IsDateString({}, { message: 'The field "estimated_delivery_at" must be a valid date' })
  @IsNotEmpty({ message: 'The field "estimated_delivery_at" cannot be empty' })
  estimated_delivery_at: string;
}
