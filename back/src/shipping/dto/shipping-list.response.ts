import { ShipmentSummaryDto } from './shipment-summary.dto';
import { PaginationDtoOut } from '../../shared/dto/pagination.dto';

export class ShippingListResponse {
  shipments!: ShipmentSummaryDto[];
  pagination!: PaginationDtoOut;
}