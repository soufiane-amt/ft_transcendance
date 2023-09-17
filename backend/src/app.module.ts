import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma/prisma.module';
import { WebSocketGatewayClass } from './Dashboard/dashboard/WebSocketGatewayClass';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './Dashboard/dashboard/upload.controller';
import { DashboardController } from './Dashboard/dashboard/dashboard.controller';

@Module({
  imports: [PrismaModule, MulterModule.register({
    dest: './uploads',
  })],
  controllers: [DashboardController],
  providers: [WebSocketGatewayClass, AppService],
})
export class AppModule {}
