import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { CostCalculatorService } from './services/cost-calculation-service';
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
import GetShipmentsRepository from './repositories/get-shipments.repository';
import { MysqlGetShipmentsRepository } from './repositories/mysql/mysql_get_shipments.repository';
import { ShippingLog } from './entities/shipping-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      Address,
      Product,
      ShipmentProduct,
      TransportMethod,
      User,
      ShippingLog
    ])
  ],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    CostCalculatorService,
    {
      provide: TransportMethodsRepository,
      useClass: MySqlTransportMethodsRepositories
    },
    {
      provide: ShipmentRepository,
      useClass: MySqlShipmentRepository
    },
    {
      provide: GetShipmentsRepository,
      useClass: MysqlGetShipmentsRepository
    }
  ]
})
export class ShippingModule { }