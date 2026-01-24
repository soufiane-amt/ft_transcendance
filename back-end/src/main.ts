import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    // origin: '*',
  });

  const port = process.env.PORT || 3001;

  await app.listen(8000, '0.0.0.0');

  console.log(`NestJS is running on port ${port}`);
}
bootstrap();
