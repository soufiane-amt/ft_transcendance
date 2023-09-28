import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // app.enableCors({
  //   origin: 'http://localhost:3000', // replace with your origin
  //   credentials: true,
  // });


  // const server = new Server(app.getHttpServer());

  // // Create a socket.io server instance and configure it
  // const io = require('socket.io')(server, {
  //   cors: {
  //     origin: 'http://localhost:3000',
  //     // methods: ['GET', 'POST'],
  //     credentials: true,
  //   },
  // });

  // Use the IoAdapter as the WebSocket adapter for Nest.js
  // app.useWebSocketAdapter(new IoAdapter(io));

  await app.listen(3001);
}
bootstrap();
