import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransporteModule } from './transporte/transporte.module';

@Module({
  imports: [TransporteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
