import { Module } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { ChatController } from './chat.controller';
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { channelGateway } from './services/channel-service/channel.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  providers: [DmService, dmGateway, channelGateway],
  controllers: [ChatController],
  imports: [PrismaModule]
})
export class ChatModule {}
