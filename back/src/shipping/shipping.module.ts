import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { ShippingCancelService } from './services/shipping-cancel.service';
import { ShippingServicePagination } from './services/shipping-pagination.service';
import { Shipment } from './entities/shipment.entity';
import { Address } from './entities/address.entity';
import { Product } from './entities/product.entity';
import { TransportMethod } from './entities/transport-method.entity';
import { User } from './entities/user.entity';
import { ShipmentProduct } from './entities/shipment-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, Address, Product, TransportMethod, User, ShipmentProduct]),
  ],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingCancelService,
    ShippingServicePagination,
  ],
})
export class ShippingModule { }