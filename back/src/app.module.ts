import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingModule } from './shipping/shipping.module';
import { Shipment } from './shipping/entities/shipment.entity';
import { Address } from './shipping/entities/address.entity';
import { User } from './shipping/entities/user.entity';
import { Product } from './shipping/entities/product.entity';
import { TransportMethod } from './shipping/entities/transport-method.entity';
import { ShipmentProduct } from './shipping/entities/shipment-product.entity';
import { KeycloakModule } from './auth/keycloak.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'shipping_db',
      entities: [
        Shipment,
        Address,
        User,
        Product,
        TransportMethod,
        ShipmentProduct,
      ],
      synchronize: true,
      logging: true,
    }),
    KeycloakModule,
    ShippingModule,
  ],
})
export class AppModule {}
