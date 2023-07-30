import { Controller, Get, Query, HttpException, HttpStatus, Res,Req,  Param, ParseBoolPipe, Inject } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request } from "express"
import { ChatCrudService } from 'src/prisma/prisma/chat-crud.service';
import { dmGateway } from './services/direct-messaging/dm.gateway';


@Controller('chat/direct_messaging')
export class ChatController
{
    constructor (private readonly dmService :DmService, 
                    private readonly chatCrud : ChatCrudService,
                    @Inject(dmGateway) private readonly dmGate : dmGateway){}
    
  @Get (":uid")
  async getUserToDm (@Param("uid") userToDm: string ,@Req() request : Request, @Res() response )
  {
    await this.chatCrud.deleteChannel ("241e8958-7ab5-4bf7-85e0-d6dd0a6e2bff")
    const user_id  = request.cookies["user.id"]
    const users_id = await this.dmService.checkFriendshipExistence (user_id, userToDm)
    if (!users_id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    var dmRoom_id :string  = await this.dmService.checkDmTableExistence (user_id, userToDm)
    console.log (`${user_id} , ${userToDm}`)
    if (!dmRoom_id)
    {
     dmRoom_id = await this.dmService.createDmTable (user_id, userToDm) 
     dmRoom_id += '/?init=true'
    }
    else
      dmRoom_id = `${dmRoom_id}/?init=false`
    console.log (`/chat/direct_messaging/@me/${dmRoom_id}`)
    response.redirect (`/chat/direct_messaging/@me/${dmRoom_id}`)
  }

  //When the front-end part receives  this response 
  //it will have two data element in an array of json format 
  //the array will also contain the user_id to which the message will be sent
  //that will be used later 
  @Get('/@me/:id')
  async findAllDm (@Req() request : Request,  @Param("id") room : string, @Query("init") init : string)
  {

    console.log (init)
    const allRoomMessages = await this.chatCrud.retrieveRoomMessages(room)
    const dmUsers = await this.dmService.getAllDmRooms (request.cookies["user.id"])
  
    return [allRoomMessages, dmUsers]
  }

}
