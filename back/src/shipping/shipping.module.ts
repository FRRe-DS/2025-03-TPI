import { Module } from '@nestjs/common';

import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { ShippingServicePagination } from './services/shipping-pagination.service';
import { ShippingCancelService } from './services/shipping-cancel.service';

@Module({
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingServicePagination,
    ShippingCancelService,
  ],
  exports: [ShippingService, ShippingServicePagination, ShippingCancelService],
})
export class ShippingModule {}
