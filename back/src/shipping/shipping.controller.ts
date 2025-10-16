import {
  Controller,
  Post,
  Get,
  HttpCode,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Public, Scopes } from 'nest-keycloak-connect';

import { CreateShipmentDto } from './dto/create-shippment.dto';
import { CostCalculationRequestDto } from './dto/cost-calculation-request.dto';
import { TransportMethodsResponseDto } from './dto/transport-methods-response.dto';
import { ShippingListResponse } from './dto/shipping-list.response';
import { ShippingDetailsResponseDto } from './dto/shipping-detail.dto';
import { ShippingService } from './services/shipping.service';
import { PaginationInDto } from 'src/shared/dto/pagination-in-dto';
import { ShippingStatus } from 'src/shared/enums/shipping-status.enum';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
  ) {}

  @Post()
  @HttpCode(200)
  @Scopes('envios:write')
  async createShippingOrder(@Body() ship: CreateShipmentDto) {
    return await this.shippingService.createShipment(ship);
  }

  @Get('transport-methods')
  @Public()
  async getTransportMethods(): Promise<TransportMethodsResponseDto> {
    return await this.shippingService.getTransportMethods();
  }

  @Get()
  @Scopes('envios:read')
  async getShippingOrders(
    @Query() { page, items_per_page }: PaginationInDto,
  ): Promise<ShippingListResponse> {
    return await this.shippingService.ShippingServicePagination(page, items_per_page);
  }

  @Get(':id')
  @Scopes('envios:read')
  async getShippingOrderById(@Param('id') id: number): Promise<ShippingDetailsResponseDto> {
    return await this.shippingService.findById(id);
  }

  @Post(':id/cancel') 
  @HttpCode(200)
  @Scopes('envios:write')
  async cancelShippingOrder(@Param('id') id: number) {
    return await this.shippingService.cancelShipment(id);
  }

  @Post('cost')
  @HttpCode(200)
  @Scopes('envios:write')
  async calculateShippingCost(@Body() costRequest: CostCalculationRequestDto) {
    return await this.shippingService.calculateCost(costRequest);
  }
}
