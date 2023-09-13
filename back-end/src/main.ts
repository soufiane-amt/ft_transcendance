import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  // app.enableCors({
  //   origin: 'http://localhost:3000', // replace with your origin
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });
  await app.listen(3001);
}
bootstrap();
