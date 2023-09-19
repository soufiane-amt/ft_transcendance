import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  // do not forgot to import prisma module here
  imports: [PrismaModule, ConfigModule.forRoot(), ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
