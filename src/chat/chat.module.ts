import { Module } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { ChatController } from './chat.controller';
import { dmGateway } from './services/direct-messaging/dm.gateway';

@Module({
  providers: [DmService, dmGateway],
  controllers: [ChatController]
})
export class ChatModule {}
