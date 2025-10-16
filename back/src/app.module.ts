import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    // Carga variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configura conexión a MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'shipping_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ⚠️ Solo en desarrollo - crea tablas automáticamente
      logging: true,     // Muestra las queries SQL en consola (útil para debug)
    }),

    ShippingModule,
  ],
})
export class AppModule { }