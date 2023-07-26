import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';


@Controller('chat/direct_messaging')
export class ChatController
{
    constructor (private readonly dmService :DmService){}
    
  @Get ()
  async getUserToDm (@Query('u1') user: string, @Query('u2') userToDm: string)
  {
    const users_id = await this.dmService.checkFriendshipExistence (user, userToDm)
    if (!users_id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      
  }
}
