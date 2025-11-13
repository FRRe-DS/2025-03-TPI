import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingModule } from './shipping/shipping.module';
import { KeycloakModule } from './auth/keycloak.module';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // No se usa en Railway, pero está bien dejarlo
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        
        // Lee las variables desde ConfigService, no desde process.env
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        
        autoLoadEntities: true,
        // Lee NODE_ENV también desde ConfigService
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
        
        retryAttempts: 10,  // Reintenta la conexión 10 veces
        retryDelay: 5000,   // Espera 5 segundos entre intentos
        
        extra: {
          connectionLimit: 10,
          connectTimeout: 60000,
        },
      }),
    }),
    // --- FIN DE LA VERSIÓN CORREGIDA ---
    
    KeycloakModule,
    ShippingModule,
    SeedModule,
  ],
})
export class AppModule {}