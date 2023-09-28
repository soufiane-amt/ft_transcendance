import { Module } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { channelGateway } from './services/channel-service/channel.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  providers: [DmService, dmGateway, channelGateway],
  controllers: [],
  imports: [PrismaModule]
})
export class ChatModule {}
