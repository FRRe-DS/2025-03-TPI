import {
  Controller,
  Post,
  Get,
  HttpCode,
  Param,
  Body,
  Query,
  UsePipes,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Public, Scopes } from 'nest-keycloak-connect';

import { CreateShippmentRequestDto } from './dto/create-shippment-request.dto';
import { CostCalculationRequestDto } from './dto/cost-calculation-request.dto';
import { TransportMethodsResponseDto } from './dto/transport-methods-response.dto';
import { ShippingListResponseDto } from './dto/shipping-list.response';
import { ShippingDetailsResponseDto } from './dto/shipping-detail.dto';
import { ShippingService } from './services/shipping.service';
import { PaginationInDto } from 'src/shared/dto/pagination-in-dto';
import { CreateShippingResponseDto } from './dto/create-shipment-response.dto';
import { CancelShippingResponseDto } from './dto/cancel-shipping-response.dto';
import { CostCalculationResponseDto } from './dto/cost-calculation-response.dto';
import { ContextValidationPipe } from 'src/common/exceptions/custom-validation-pipe.exception';
import { InvalidCostCalculationException } from 'src/common/exceptions/invalid-cost-calculation.exception';
import { InvalidShippingOrderException } from 'src/common/exceptions/invalid-shipping-order.exception';
import { UnexpectedErrorException } from 'src/common/exceptions/unexpected-error.exception';
import { ShippingIdNotFoundException } from 'src/common/exceptions/shipping-id-notfound.exception';
import { ShippingIdNonCancellableException } from 'src/common/exceptions/shipping-id-noncancellable.exception';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
  ) { }

  @Get('test')
  @Public()
  async getTransportMethodsTest(): Promise<any> {
    return { message: 'Hello World' };
  }

  @Post()
  @HttpCode(200)
  @Public()
  // @Scopes('envios:write')
  @UsePipes(new ContextValidationPipe(InvalidShippingOrderException))
  async createShippingOrder(@Body() ship: CreateShippmentRequestDto): Promise<CreateShippingResponseDto> {
    return await this.shippingService.createShipment(ship);
  }

  @Get('transport-methods')
  @Public()
  @UsePipes(new ContextValidationPipe(UnexpectedErrorException))
  async getTransportMethods(): Promise<TransportMethodsResponseDto> {
    return await this.shippingService.getTransportMethods();
  }

  @Get()
  @Public()
  //@Scopes('envios:read')
  @UsePipes(new ContextValidationPipe(UnexpectedErrorException))
  async getShippingOrders(
    @Query() { page, items_per_page }: PaginationInDto,
  ): Promise<ShippingListResponseDto> {
    return await this.shippingService.ShippingServicePagination(page, items_per_page);
  }

  @Get(':id')
  @Public()
  // @Scopes('envios:read')
  @UsePipes(new ContextValidationPipe(ShippingIdNotFoundException))
  async getShippingOrderById(@Param('id') id: number): Promise<ShippingDetailsResponseDto> {
    return await this.shippingService.findById(id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @Public()
  //@Scopes('envios:write')
  @UsePipes(new ContextValidationPipe(ShippingIdNonCancellableException))
  async cancelShippingOrder(@Param('id') id: number): Promise<CancelShippingResponseDto> {
    return await this.shippingService.cancelShipment(id);
  }

  @Post('cost')
  @HttpCode(200)
  @Scopes('envios:write')
  @UsePipes(new ContextValidationPipe(InvalidCostCalculationException))
  async calculateShippingCost(@Body() costRequest: CostCalculationRequestDto): Promise<CostCalculationResponseDto> {
    return await this.shippingService.calculateCost(costRequest);
  }
}
