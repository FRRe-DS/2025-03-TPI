import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { ShippingCancelService } from './services/shipping-cancel.service';
import { ShippingServicePagination } from './services/shipping-pagination.service';
import { Shipment } from './entities/shipment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment]), // Registra la entidad
  ],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingCancelService,
    ShippingServicePagination,
  ],
})
export class ShippingModule { }