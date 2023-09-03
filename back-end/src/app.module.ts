import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  // do not forgot to import prisma module here
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
