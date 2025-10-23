import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingModule } from './shipping/shipping.module';
import { KeycloakModule } from './auth/keycloak.module';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql', //antes estaba como localhost, ahora necesito definir el nombre porque el contenedor toma como que es dentro de si mismo
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'shipping_db',

      autoLoadEntities: true, // escanea todos los directorios de este proyecto y busca cualquier archivo que termine en .entity.ts
      synchronize: true,
      logging: true,
    }),
    KeycloakModule,
    ShippingModule,
    SeedModule,
  ],
})
export class AppModule { }
