import { Module } from '@nestjs/common';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [ShippingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
