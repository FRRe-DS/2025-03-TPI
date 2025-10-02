import { Injectable } from '@nestjs/common';
import { TransportMethodsResponseDto } from './dto/transport-methods-response.dto';
import { TransportMethods } from './dto/transport-methods.enum'; 
import { ShippingListResponse } from './dto/shipping-list.response';
import { ShipmentSummaryDto } from './dto/shipment-summary.dto';
import { ProductQtyDto } from './dto/product-qty.dto';
import { ShippingStatus } from './dto/shipping-status.enum';



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