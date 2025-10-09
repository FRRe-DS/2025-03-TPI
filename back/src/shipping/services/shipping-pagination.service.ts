import { Injectable } from '@nestjs/common';

import { ShippingListResponse } from '../dto/shipping-list.response';
import { ShipmentSummaryDto } from '../dto/shipment-summary.dto';
import * as shipmentsData from '../../shared/data/shippments.json';

@Injectable()
export class ShippingServicePagination {
  private data: ShipmentSummaryDto[] = shipmentsData.shipments as ShipmentSummaryDto[];

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

