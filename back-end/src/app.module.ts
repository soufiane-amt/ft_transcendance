import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DashboardModule } from './dashboard/dashboard.module';
import { TwoFactorAuthModule } from './2fa/TwoFactorAuth.module';
import { GameModule } from './game/game.module';
import { ChatModule } from 'src/chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  // do not forgot to import prisma module here
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot(),
    DashboardModule,
    TwoFactorAuthModule,
    GameModule,
    ChatModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
