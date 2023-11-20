import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadController } from './upload.controller';
import { WebSocketGatewayClass } from './WebSocketGatewayClass';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    GameModule,
  ],
  controllers: [UploadController, DashboardController],
  providers: [WebSocketGatewayClass, AuthService, JwtService],
})
export class DashboardModule {}
