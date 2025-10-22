import { PaginationDtoOut } from '../../shared/dto/pagination.dto';
import { ShipmentSummaryDto } from './shipment-list-summarized.dto';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class ShippingListResponseDto {
  
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShipmentSummaryDto)
  shipments: ShipmentSummaryDto[];
  
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationDtoOut)
  pagination: PaginationDtoOut;
}