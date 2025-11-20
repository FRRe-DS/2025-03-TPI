import { IsNotEmpty, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

export class CancelShippingResponseDto {

  @IsNumber({}, { message: 'The field "shipping_id" must be a number' })
  @IsNotEmpty({ message: 'The field "shipping_id" cannot be empty' })
  shipping_id: number;

  @IsEnum(ShippingStatus, { message: 'The field "status" must be a valid value from the ShippingStatus enum' })
  @IsNotEmpty({ message: 'The field "status" cannot be empty' })
  status: ShippingStatus;

  @IsDateString({}, { message: 'The field "cancelled_at" must be a valid date' })
  @IsNotEmpty({ message: 'The field "cancelled_at" cannot be empty' })
  cancelled_at: string;
}