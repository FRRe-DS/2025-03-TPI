import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShippingServicePagination, ShippingCancelService } from './shipping.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, ShippingServicePagination, ShippingCancelService],
  exports: [ShippingService, ShippingServicePagination, ShippingCancelService],
})
export class ShippingModule {}
