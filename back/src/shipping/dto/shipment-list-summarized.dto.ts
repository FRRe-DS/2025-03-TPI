import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductQtyDto } from './product-qty.dto';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

export class ShipmentSummaryDto {
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

  @IsArray({ message: 'The field "products" must be an array' })
  @ArrayNotEmpty({ message: 'The field "products" cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => ProductQtyDto)
  products: ProductQtyDto[];

  @IsEnum(ShippingStatus)
  @IsNotEmpty({ message: 'The field "status" cannot be empty' })
  status: ShippingStatus;

  @IsEnum(TransportMethods)
  @IsNotEmpty({ message: 'The field "transport_type" cannot be empty' })
  transport_type: TransportMethods;

  @IsDateString({}, { message: 'The field "estimated_delivery_at" must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'The field "estimated_delivery_at" cannot be empty' })
  estimated_delivery_at: string;

  @IsDateString({}, { message: 'The field "created_at" must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'The field "created_at" cannot be empty' })
  created_at: string;
}