import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 SABSE ZAROORI: CORS Enable karna
  app.enableCors({
    origin: '*', // Iska matlab: "Sabko allow karo"
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Render automatically PORT assign karta hai, fallback 3001 hai
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
