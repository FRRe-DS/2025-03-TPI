import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

type ShippingRecord = {
  id: number;
  status: ShippingStatus;
  cancelled_at?: string;
};

@Injectable()
export class ShippingCancelService {
  private readonly db = new Map<number, ShippingRecord>([
    [1, { id: 1, status: ShippingStatus.CREATED }],
    [2, { id: 2, status: ShippingStatus.IN_TRANSIT }],
    [3, { id: 3, status: ShippingStatus.RESERVED }],
  ]);

  private getOr404(id: number): ShippingRecord {
    const row = this.db.get(id);
    if (!row) throw new NotFoundException('Shipment not found');
    return row;
  }

  private canCancel(status: ShippingStatus): boolean {
    return (
      status === ShippingStatus.CREATED || status === ShippingStatus.RESERVED
    );
  }

  cancel(shippingId: number) {
    const row = this.getOr404(shippingId);

    if (row.status === ShippingStatus.CANCELLED) {
      // ya estaba cancelado → 409
      throw new ConflictException('Shipment is already cancelled');
    }

    if (!this.canCancel(row.status)) {
      // estado no permitido para cancelar → 400
      throw new BadRequestException(
        `Shipment cannot be cancelled from status '${row.status}'.`,
      );
    }

    // ok: aplicamos la cancelación
    const now = new Date().toISOString();
    row.status = ShippingStatus.CANCELLED;
    row.cancelled_at = now;
    this.db.set(row.id, row);

    // respuesta alineada con el schema de la OpenAPI
    return {
      shipping_id: row.id,
      status: 'cancelled' as const,
      cancelled_at: now,
    };
  }
}

