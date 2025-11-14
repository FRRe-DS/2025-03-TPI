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
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('DB_HOST', 'mysql.railway.internal'),

        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),

        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', ''),
        database: configService.get<string>('DB_NAME', 'railway'),
        
        

        autoLoadEntities: true,
        
        synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
        logging: configService.get<string>('NODE_ENV', 'development') !== 'production',

        retryAttempts: 10,
        retryDelay: 5000,

        extra: {
          connectionLimit: 10,
          connectTimeout: 60000,
        },
      }),
    }),

    KeycloakModule,
    ShippingModule,
    SeedModule,
  ],
})
export class AppModule {}