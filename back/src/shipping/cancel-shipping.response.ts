
export class CancelShippingResponse {
  // id del envío que cancelamos
  shipping_id!: number;
  // estado final (siempre 'cancelled' si todo va bien)
  status!: 'cancelled';
  // timestamp ISO de cuándo se canceló
  cancelled_at!: string;
}
