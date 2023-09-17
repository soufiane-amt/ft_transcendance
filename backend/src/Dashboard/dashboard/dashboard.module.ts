import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { WebSocketGatewayClass } from 'src/Dashboard/dashboard/WebSocketGatewayClass';
import { PrismaModule } from 'src/prisma/prisma/prisma.module';
import { UploadController } from 'src/Dashboard/dashboard/upload.controller';
import { DashboardController } from './dashboard.controller';

@Module({
    imports: [PrismaModule, MulterModule.register({
        dest: './uploads',
      })],
      controllers: [UploadController, DashboardController],
      providers: [WebSocketGatewayClass],
})
export class DashboardModule {}
