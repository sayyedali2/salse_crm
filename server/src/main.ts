import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 SABSE ZAROORI: CORS Enable karna
  app.enableCors({
    origin: '*', // Iska matlab: "Sabko allow karo" (Vercel ko access mil jayega)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Render automatically PORT assign karta hai, fallback 3001 hai
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();