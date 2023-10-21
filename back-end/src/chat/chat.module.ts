import { Module } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { ChatController } from './chat.controller';
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { channelGateway } from './services/channel-service/channel.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { channelsService } from './services/channel-service/channel.service';


@Module({
  providers: [DmService, channelsService, dmGateway, channelGateway],
  controllers: [ChatController],
  imports: [PrismaModule]
})
export class ChatModule {}
