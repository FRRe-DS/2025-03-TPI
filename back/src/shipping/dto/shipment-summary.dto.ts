import { ProductQtyDto } from "./product-qty.dto";
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

export class ShipmentSummaryDto {
  shipping_id!: number;
  order_id!: number;
  user_id!: number;
  products!: ProductQtyDto[];
  status!: ShippingStatus;
  transport_type!: TransportMethods;
  estimated_delivery_at!: string; // ISO-8601
  created_at!: Date;            // ISO-8601
}