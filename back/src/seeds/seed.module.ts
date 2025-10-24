import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { TransportMethod } from '../shipping/entities/transport-method.entity';
import TransportMethodsRepository from '../shipping/repositories/transport_methods.repository';
import MySqlTransportMethodsRepositories from '../shipping/repositories/mysql/mysql_transport_methods_repositories';

import { Address } from '../shipping/entities/address.entity';
import AddressRepository from '../shipping/repositories/address.repository';
import MySqlAddressRepository from '../shipping/repositories/mysql/mysql_address_repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportMethod, Address])
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
  ],
  exports: [SeedService]
})
export class SeedModule {}

