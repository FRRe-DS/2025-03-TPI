import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/global-exception.filter.exception';
import { ValidationErrorException } from './common/exceptions/validation-error.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde cualquier origen
  app.enableCors({
    origin: true, // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permitir cookies y headers de autenticación
  });


  // Registrar el filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());
  
  //app.useGlobalFilters(new HttpExceptionFilter());

  //  app.useGlobalPipes(
  //  new ValidationPipe({
  //    whitelist: true, // Elimina propiedades no definidas en el DTO
  //    forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
  //    transform: true, // Transforma automáticamente los tipos
  //    exceptionFactory: (errors) => {
  //      // Personaliza el mensaje de error
  //      return new ValidationErrorException(errors);
  //    },
  //  }),
  //);

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3010;
  await app.listen(PORT);
  console.log(`🚀  Server ready at http://${HOST}:${PORT}`)
}
bootstrap();