import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://ft-transcendance-three.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const port = 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`NestJS is running on port ${port}`);
}
bootstrap();
