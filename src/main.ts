import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip unknown fields
      forbidNonWhitelisted: true, // throw if extra fields sent
      transform: true,            // auto DTO transform
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js / frontend
      'http://127.0.0.1:3000',
    ],
    credentials: true, // 🔴 MUST be true for cookies
  });

  // Optional but recommended
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();