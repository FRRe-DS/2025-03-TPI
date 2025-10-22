import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

//TODO Implementar el log de modificaciones del shipment
export class ShippingLogDto {
  timestamp!: string;
  status!: ShippingStatus;
  message!: string;
}