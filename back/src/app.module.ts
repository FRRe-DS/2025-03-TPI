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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'shipping_db',
      
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ Importante: desactiva en producción
      logging: process.env.NODE_ENV !== 'production',
      
      // Configuraciones adicionales para Railway/producción
      extra: {
        connectionLimit: 10,
        connectTimeout: 60000,
      },
    }),
    KeycloakModule,
    ShippingModule,
    SeedModule,
  ],
})
export class AppModule { }
