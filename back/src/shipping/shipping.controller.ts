import {
  Controller,
  Post,
  Get,
  HttpCode,
  Param,
  Body,
  Query,
} from '@nestjs/common';

import { CreateShipmentDto } from './dto/create-shippment.dto';
import { CostCalculationRequestDto } from './dto/cost-calculation-request.dto';
import { TransportMethodsResponseDto } from './dto/transport-methods-response.dto';
import { ShippingListResponse } from './dto/shipping-list.response';
import { ShippingDetailsResponseDto } from './dto/shipping-detail.dto';
import { ShippingService } from './services/shipping.service';
import { ShippingServicePagination } from './services/shipping-pagination.service';
import { PaginationInDto } from 'src/shared/dto/pagination-in-dto';
import { ShippingStatus } from 'src/shared/enums/shipping-status.enum';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
    private readonly shippingServicePagination: ShippingServicePagination,
  ) {}

  @Post()
  @HttpCode(200)
  createShippingOrder(@Body() ship: CreateShipmentDto) {
    return { message: 'Shipping order created successfully', order: ship };
  }

  @Get('transport-methods')
  getTransportMethods(): TransportMethodsResponseDto {
    return this.shippingService.getTransportMethods();
  }

  @Get()
  getShippingOrders(
    @Query() { page, items_per_page }: PaginationInDto,
  ): ShippingListResponse {
    return this.shippingServicePagination.list(page, items_per_page);
  }

  @Get(':id')
  getShippingOrderById(@Param('id') id: number): ShippingDetailsResponseDto {
    return {
      shipping_id: id,
      order_id: 123,
      user_id: 456,
      deliveryAddress: {
        street: 'Av. Siempre Viva 742',
        city: 'Springfield',
        state: 'Illinois',
        country: 'US',
        postalCode: '62704',
      },
      departureAddress: {
        street: 'Depósito Central',
        city: 'Springfield',
        state: 'Illinois',
        country: 'US',
        postalCode: '62701',
      },
      products: [{ id: 1, quantity: 2 }],
      shippingStatus: ShippingStatus.IN_TRANSIT,
      transport_type: { type: 'road' },
      estimated_delivery_at: '2025-10-01T00:00:00Z',
      created_at: '2025-09-01T10:00:00Z',
      updated_at: '2025-09-20T10:00:00Z',
      logs: [
        {
          timestamp: '2025-09-15T09:29:00Z',
          status: ShippingStatus.IN_TRANSIT,
          message: 'Shipment is in distribution',
        },
        {
          timestamp: '2025-09-10T14:00:00Z',
          status: ShippingStatus.CREATED,
          message: 'Shipment created',
        },
      ],
    };
  }

  @Post(':id/cancel') 
  @HttpCode(200)
  cancelShippingOrder(@Param('id') id: number) {
    return { message: `Shipping order ${id} canceled successfully` };
  }

  @Post('cost')
  @HttpCode(200)
  calculateShippingCost(@Body() costRequest: CostCalculationRequestDto) {
    return { cost: 10.0 }; 
  }
}
