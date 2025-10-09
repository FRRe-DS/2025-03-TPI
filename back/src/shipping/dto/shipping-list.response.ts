import { ShipmentSummaryDto } from './shipment-summary.dto';
import { PaginationDtoOut } from './pagination.dto';

export class ShippingListResponse {
  shipments!: ShipmentSummaryDto[];
  pagination!: PaginationDtoOut;
}