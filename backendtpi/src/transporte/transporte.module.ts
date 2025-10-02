import { Module } from '@nestjs/common';
import { TransporteController } from './transporte.controller';

@Module({
  controllers: [TransporteController]
})
export class TransporteModule {}
