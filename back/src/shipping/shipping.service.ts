import { Injectable } from '@nestjs/common';
import { TransportMethodsResponseDto } from './dto/transport-methods-response.dto';
import { TransportMethods } from './dto/transport-methods.enum'; 
import { ShippingListResponse } from './dto/shipping-list.response';
import { ShipmentSummaryDto } from './dto/shipment-summary.dto';
import { ProductQtyDto } from './dto/product-qty.dto';
import { ShippingStatus } from './dto/shipping-status.enum';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';


@Injectable()
export class ShippingService {
    getTransportMethods(): TransportMethodsResponseDto {
        return {
            transportMethods: [
                {
                    type: TransportMethods.AIR,
                    name: 'Air',
                    estimatedDeliveryTimeInDays: [1, 2]
                },
                {
                    type: TransportMethods.SEA,
                    name: 'Sea',
                    estimatedDeliveryTimeInDays: [5, 10]
                },
                {
                    type: TransportMethods.ROAD,
                    name: 'Road',
                    estimatedDeliveryTimeInDays: [3, 7]
                },
                {
                    type: TransportMethods.RAIL,
                    name: 'Rail',
                    estimatedDeliveryTimeInDays: [4, 8]
                }
            ]
        };
    }
}

@Injectable()
export class ShippingServicePagination {
  // Simulamos “datos” en memoria para la demo
  private data: ShipmentSummaryDto[] = Array.from({ length: 87 }).map((_, i) => ({
    shipping_id: 700 + i,
    order_id: 100 + (i % 25),
    user_id: 400 + (i % 10),
    products: [
      { productId: 900 + (i % 5), quantity: 1 + (i % 3) } as ProductQtyDto,
    ],
    status: [ShippingStatus.CREATED, ShippingStatus.IN_TRANSIT, ShippingStatus.DELIVERED][i % 3],
    transport_type: [TransportMethods.AIR, TransportMethods.SEA, TransportMethods.ROAD][i % 3],
    estimated_delivery_at: new Date(Date.now() + 86400000 * (2 + (i % 5))).toISOString(),
    created_at: new Date(Date.now() - 86400000 * (i % 15)).toISOString(),
  }));

  list(page: number, itemsPerPage: number): ShippingListResponse {
    const totalItems = this.data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const shipments = this.data.slice(start, end);

    return {
      shipments,
      pagination: {
        current_page: currentPage,
        total_pages: totalPages,
        total_items: totalItems,
        items_per_page: itemsPerPage,
      },
    };
  }
}

// ====== NUEVO: tipo interno para “fila” del envío ======
type ShippingRecord = {
  id: number;
  status: ShippingStatus;
  cancelled_at?: string;
  // acá podrían ir otros campos reales (order_id, user_id, etc.)
};

@Injectable()
export class ShippingCancelService {
  // ====== NUEVO: “repositorio” en memoria solo para demo ======
  private readonly db = new Map<number, ShippingRecord>([
    [1, { id: 1, status: ShippingStatus.CREATED }],
    [2, { id: 2, status: ShippingStatus.IN_TRANSIT }],
    [3, { id: 3, status: ShippingStatus.RESERVED }],
  ]);

  // ====== NUEVO: helper para buscar o lanzar 404 ======
  private getOr404(id: number): ShippingRecord {
    const row = this.db.get(id);
    if (!row) throw new NotFoundException('Shipment not found');
    return row;
  }

  // ====== NUEVO: regla de negocio (solo created/reserved pueden cancelarse) ======
  private canCancel(status: ShippingStatus): boolean {
    return (
      status === ShippingStatus.CREATED || status === ShippingStatus.RESERVED
    );
  }

  // ====== NUEVO: método principal del endpoint POST /shipping/:id/cancel ======
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
  }}