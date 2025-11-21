import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingModule } from './shipping/shipping.module';
import { KeycloakModule } from './auth/keycloak.module';
import { SeedModule } from './seeds/seed.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql', 
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'shipping_db',

      autoLoadEntities: true, 
      synchronize: true,
      logging: true,
    }),
    KeycloakModule,
    GatewayModule,
    ShippingModule,
    SeedModule,
  ],
})
export class AppModule { }
