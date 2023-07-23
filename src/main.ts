import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();


//private messaging 
//if the message is firstly intialized 
///you create a new Dm
//if not look for the Dm id 