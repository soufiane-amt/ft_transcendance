import { Controller, Get, Query, HttpException, HttpStatus, Res,Req,  Param } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request } from "express"


@Controller('chat/direct_messaging')
export class ChatController
{
    constructor (private readonly dmService :DmService){}
    
  @Get ()
  async getUserToDm (@Query('u1') user: string, @Query('u2') userToDm: string, @Res() response )
  {
    const users_id = await this.dmService.checkFriendshipExistence (user, userToDm)
    if (!users_id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    var dmRoom_id :string  = await this.dmService.checkDmTableExistence (users_id.user1_id, users_id.user2_id)
    if (!dmRoom_id)
      dmRoom_id = await this.dmService.createDmTable (users_id.user1_id, users_id.user2_id)
    response.redirect ('/chat/direct_messaging/' + dmRoom_id)
  }

  @Get (':id')
  async findAllDm (@Req() request : Request,  @Param() param : any)
  {
    // const allMessages = await this.dmService.getAllDmMessages(param)
    // const   
    // request
    console.log (request)

    console.log(request.headers['cookie']);
  }
}
