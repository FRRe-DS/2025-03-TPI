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

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportMethod, Address, Product])
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
  ],
  exports: [SeedService]
})
export class SeedModule {}

