import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeedService } from './seed.service';
import { TransportMethod } from '../shipping/entities/transport-method.entity';
import TransportMethodsRepository from '../shipping/repositories/transport_methods.repository';
import MySqlTransportMethodsRepositories from '../shipping/repositories/mysql/mysql_transport_methods_repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportMethod])
  ],
  providers: [
    DatabaseSeedService,
    {
      provide: TransportMethodsRepository,
      useClass: MySqlTransportMethodsRepositories
    }
  ],
  exports: [DatabaseSeedService]
})
export class SeedModule {}

