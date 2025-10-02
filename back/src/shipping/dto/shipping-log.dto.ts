import { ShippingStatus } from './shipping-status.enum';

export class ShippingLogDto {
  /** Fecha y hora del cambio (ISO-8601, UTC) */
  timestamp!: string;

  /** Nuevo estado del envío */
  status!: ShippingStatus;

  /** Mensaje legible */
  message!: string;
}