import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde cualquier origen
  app.enableCors({
    origin: true, // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permitir cookies y headers de autenticación
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // elimina campos no declarados en DTO
    forbidNonWhitelisted: true, // si aparece un campo extra => 400
    transform: true,            // castea tipos (query/params)
  }));

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3010;
  await app.listen(PORT);
  console.log(`🚀  Server ready at http://${HOST}:${PORT}`)
}
bootstrap();