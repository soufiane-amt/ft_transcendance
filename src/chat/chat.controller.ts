import { Controller, Get, Query, HttpException, HttpStatus, Res,Req,  Param } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request } from "express"


@Controller('chat/direct_messaging')
export class ChatController
{
    constructor (private readonly dmService :DmService){}
    
  @Get ()
  async getUserToDm (@Query('uid') userToDm: string,@Req() request : Request, @Res() response )
  {
    const user_id  = request.cookies["user.id"]

    const users_id = await this.dmService.checkFriendshipExistence (user_id, userToDm)
    if (!users_id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    var dmRoom_id :string  = await this.dmService.checkDmTableExistence (user_id, userToDm)
    if (!dmRoom_id)
      dmRoom_id = await this.dmService.createDmTable (user_id, userToDm)
    response.redirect ('/chat/direct_messaging/' + dmRoom_id)
  }

  @Get (':id')
  async findAllDm (@Req() request : Request,  @Param() param : any)
  {
    const allRoomMessages = await this.dmService.getAllDmMessages(param)

    const dmUsers = await this.dmService.getAllDmRooms (request.cookies["user.id"])
    return [allRoomMessages, dmUsers]
  }
}
