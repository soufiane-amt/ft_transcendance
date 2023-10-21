// ban-expiration-scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import { channelGateway } from './channel.gateway';

@Injectable()
export class channelsService {
  constructor(private readonly chatCrud: ChatCrudService, private readonly channelGateway : channelGateway ) {}


  @Cron(CronExpression.EVERY_10_SECONDS) // Adjust the cron expression as needed
  async handleBanExpirations() {
    console.log ('handle ban expirations')
    const expiredBans = await this.chatCrud.findExpiredBans();
    console.log ('expired bans : ' + expiredBans)
    for (const ban of expiredBans) {
      // Determine the channel and user to broadcast to
      const channel = ban.channel; // You need to define how to retrieve the channel
      const user = ban.user; // You need to define how to retrieve the user

      // Broadcast the expiration event to the user on the channel
      this.channelGateway.broadcastExpiration(channel, user);
    }
    }
}
