import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { Shipment } from './entities/shipment.entity';
import { TransportMethod } from './entities/transport-method.entity';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Product } from './entities/product.entity';
import { ShipmentProduct } from './entities/shipment-product.entity';
import TransportMethodsRepository from './repositories/transport_methods.repository';
import MySqlTransportMethodsRepositories from './repositories/mysql/mysql_transport_methods_repositories';
import ShipmentRepository from './repositories/shipment.repository';
import MySqlShipmentRepository from './repositories/mysql/mysql_shipment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      TransportMethod,
      User,
      Address,
      Product,
      ShipmentProduct
    ])
  ],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    {
      provide: TransportMethodsRepository,
      useClass: MySqlTransportMethodsRepositories
    },
    {
      provide: ShipmentRepository,
      useClass: MySqlShipmentRepository
    }
  ]
})
export class ShippingModule { }