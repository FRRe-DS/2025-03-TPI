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

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀  Server ready at http://${HOST}:${PORT}`)
}
bootstrap();