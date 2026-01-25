import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONT_SERV,
    credentials: true,
  });

  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`NestJS is running on port ${port}`);
}
bootstrap();
