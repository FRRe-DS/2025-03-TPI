import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // elimina campos no declarados en DTO
    forbidNonWhitelisted: true, // si aparece un campo extra => 400
    transform: true,            // castea tipos (query/params)
  }));

  await app.listen(3000);
}
bootstrap();