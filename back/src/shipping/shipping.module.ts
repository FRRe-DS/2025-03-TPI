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
import { MysqlShipmentRepository } from './repositories/mysql/mysql_shipment.repository';
import { ShippingLog } from './entities/shipping-log.entity';
import AddressRepository from './repositories/address.repository';
import MySqlAddressRepository from './repositories/mysql/mysql_address_repository';
import ProductRepository from './repositories/product.repository';
import MySqlProductRepository from './repositories/mysql/mysql_product.repository';
import ShipmentProductRepository from './repositories/shipment_product.repository';
import MySqlShipmentProductRepository from './repositories/mysql/mysql_shipment_product.repository';
import ShippingLogRepository from './repositories/shipping-log.repository';
import MySqlShippingLogRepository from './repositories/mysql/mysql_shipping_log.repository';
import UserRepository from './repositories/user.repository';
import MySqlUserRepository from './repositories/mysql/mysql_user_repository';

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
      useClass: MysqlShipmentRepository
    },
    {
      provide: AddressRepository,
      useClass: MySqlAddressRepository
    },
    {
      provide: ProductRepository,
      useClass: MySqlProductRepository
    },
    {
      provide: ShipmentProductRepository,
      useClass: MySqlShipmentProductRepository
    },
    {
      provide: ShippingLogRepository,
      useClass: MySqlShippingLogRepository
    },
    {
      provide: UserRepository,
      useClass: MySqlUserRepository
    },

  ]
})
export class ShippingModule { }