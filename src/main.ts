import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove unknown fields
      forbidNonWhitelisted: true, // throw error on extra fields
      transform: true,            // auto-transform DTOs
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}

bootstrap();
