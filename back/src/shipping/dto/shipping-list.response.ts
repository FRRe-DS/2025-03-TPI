import { PaginationDtoOut } from '../../shared/dto/pagination.dto';
import { ShipmentSummaryDto } from './shipment-list-summarized.dto';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class ShippingListResponseDto {
  
  @IsArray( { message: 'The field "shipments" must be an array' })
  @ArrayNotEmpty({ message: 'The field "shipments" cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => ShipmentSummaryDto)
  shipments: ShipmentSummaryDto[];
  
  @IsNotEmpty({ message: 'The field "pagination" cannot be empty' })
  @ValidateNested()
  @Type(() => PaginationDtoOut)
  pagination: PaginationDtoOut;
}