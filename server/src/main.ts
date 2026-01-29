import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import { truncateSync } from 'fs';

async function bootstrap() {
  // mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // 👇 SABSE ZAROORI: CORS Enable karna
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Render automatically PORT assign karta hai, fallback 3001 hai
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
