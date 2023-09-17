import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadController } from './upload.controller';
import { WebSocketGatewayClass } from './WebSocketGatewayClass';

@Module({
    imports: [PrismaModule, MulterModule.register({
        dest: './uploads',
      })],
      controllers: [UploadController, DashboardController],
      providers: [WebSocketGatewayClass],
})
export class DashboardModule {}
