import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { TransportMethod } from '../shipping/entities/transport-method.entity';
import TransportMethodsRepository from '../shipping/repositories/transport_methods.repository';
import MySqlTransportMethodsRepositories from '../shipping/repositories/mysql/mysql_transport_methods_repositories';

import { Address } from '../shipping/entities/address.entity';
import AddressRepository from '../shipping/repositories/address.repository';
import MySqlAddressRepository from '../shipping/repositories/mysql/mysql_address_repository';

import { Product } from '../shipping/entities/product.entity';
import ProductRepository from '../shipping/repositories/product.repository';
import MySqlProductRepository from '../shipping/repositories/mysql/mysql_product.repository';

import { User } from '../shipping/entities/user.entity';
import UserRepository from '../shipping/repositories/user.repository';
import MySqlUserRepository from '../shipping/repositories/mysql/mysql_user_repository';

import { Shipment } from '../shipping/entities/shipment.entity';
import ShipmentRepository from '../shipping/repositories/shipment.repository';
import { MysqlShipmentRepository } from '../shipping/repositories/mysql/mysql_shipment.repository';

import { ShipmentProduct } from '../shipping/entities/shipment-product.entity';
import ShipmentProductRepository from '../shipping/repositories/shipment_product.repository';
import MySqlShipmentProductRepository from '../shipping/repositories/mysql/mysql_shipment_product.repository';

import { ShippingLog } from '../shipping/entities/shipping-log.entity';
import ShippingLogRepository from '../shipping/repositories/shipping-log.repository';
import MySqlShippingLogRepository from '../shipping/repositories/mysql/mysql_shipping_log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportMethod, Address, Product, User, Shipment, ShippingLog, ShipmentProduct, ShippingLog])
  ],
  providers: [
    SeedService,
    {
      provide: TransportMethodsRepository,
      useClass: MySqlTransportMethodsRepositories
    },
    {
      provide: AddressRepository,
      useClass: MySqlAddressRepository,
    },
    {
      provide: ProductRepository,
      useClass: MySqlProductRepository,
    },
    {
      provide: UserRepository,
      useClass: MySqlUserRepository,
    },
    {
      provide: ShipmentRepository,
      useClass: MysqlShipmentRepository,
    },
    {
      provide: ShipmentProductRepository,
      useClass: MySqlShipmentProductRepository,
    },
    {
      provide: ShippingLogRepository,
      useClass: MySqlShippingLogRepository,
    }
  ],
  exports: [SeedService]
})
export class SeedModule {}

