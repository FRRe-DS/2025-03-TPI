import { IsNotEmpty, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

export class CancelShippingResponseDto {

  @IsNumber()
  @IsNotEmpty()
  shipping_id: number;

  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  status: ShippingStatus;

  @IsDateString()
  @IsNotEmpty()
  cancelled_at: string;
}