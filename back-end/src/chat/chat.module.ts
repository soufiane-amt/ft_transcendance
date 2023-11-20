import { Module } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { ChatController } from './chat.controller';
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { channelGateway } from './services/channel-service/channel.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { channelsService } from './services/channel-service/channel.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import * as path from 'path';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { GameService } from 'src/game/game.service';

//I have to import AuthService


@Module({
  providers: [DmService, channelsService, dmGateway, channelGateway, GameService],
  controllers: [ChatController],
  imports: [PrismaModule, MulterModule.register({
    dest:  undefined, // Specify the destination directory for uploaded files
  }),
  AuthModule

]
})
export class ChatModule {}
