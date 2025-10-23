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
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  shipping_id: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  user_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductQtyDto)
  products: ProductQtyDto[];

  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  status: ShippingStatus;

  @IsEnum(TransportMethods)
  @IsNotEmpty()
  transport_type: TransportMethods;

  @IsDateString()
  @IsNotEmpty()
  estimated_delivery_at: string;

  @IsDateString()
  @IsNotEmpty()
  created_at: string;
}