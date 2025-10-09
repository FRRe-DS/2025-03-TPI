import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

export class ShippingLogDto {
  timestamp!: string;
  status!: ShippingStatus;
  message!: string;
}