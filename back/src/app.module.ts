import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransporteModule } from './transporte/transporte.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [TransporteModule, ShippingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
