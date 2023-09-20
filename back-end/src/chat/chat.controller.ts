import { Controller, Get, Query,Post , Res,Req,  Param, Inject, UseGuards, Body, BadRequestException, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request, Response } from "express"
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { FriendShipExistenceGuard, cookieGuard, userRoomSubscriptionGuard } from './guards/chat.guards';
import { channelDto } from './dto/chat.dto';
import { Reflector } from '@nestjs/core';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import * as path from 'path';
import * as fs from 'fs';





@Controller('chat')
// @UseGuards(cookieGuard)
export class ChatController
{

  constructor (private readonly dmService :DmService, 
                    private readonly chatCrud : ChatCrudService,
                    @Inject(dmGateway) private readonly dmGate : dmGateway, 
                    private readonly reflector: Reflector){}


@Get('/image/:imagePth')
async getUserImage(@Param('imagePth') imagePth: string, @Res() res: Response) {
  const imagePath =  path.join(__dirname, '..', `../upload/${imagePth}`); // Go up two directories to reach the workspace root
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }
  console.log ("I'm here")
  res.sendFile(imagePath);
}
  

  @Get ("/direct_messaging/discussionsBar")
  async findAllDiscussionPartners (@Req() request : Request)
  {
    const users = await this.chatCrud.retreiveDmInitPanelData (request.cookies["user.id"])

    return (users)

  }

  @Get ("/direct_messaging/userContactsBook")
  async findAllUsersInContact (@Req() request : Request)
  {
    const users = await this.chatCrud.retrieveUserContactBook (request.cookies["user.id"])
    console.log (users)

    return (users)
  }


@Get (":roomid/messages")
async findRoomMessages (@Param("roomid") roomid:string)
{
  console.log ("room id:", roomid)
  return await this.chatCrud.retrieveRoomMessages(roomid);
}
  


  /*****Old fetching */
  @Get ("/direct_messaging/:uid")
  @UseGuards(FriendShipExistenceGuard)
  async getUserToDm (@Param("uid") userToDm: string ,@Req() request : Request, @Res() response )
  {
    const user_id  = request.cookies["user.id"]
    var dmRoom_id :string  = await this.dmService.checkDmTableExistence (user_id, userToDm)[0]
    if (!dmRoom_id)
    {
     dmRoom_id = await this.dmService.createDmTable (user_id, userToDm) 
     var init_stat = '?init=true'    //===>the init status help the next route to know if the dm just created
    }
    else
      init_stat = `?init=false`
    console.log (`/chat/direct_messaging/@me/${dmRoom_id}/${init_stat}`)
    response.redirect (`/chat/direct_messaging/@me/${dmRoom_id}/${init_stat}`)
  }


  //When the front-end part receives  this response 
  //it will have two data element in an array of json format 
  //the array will also contain the user_id to which the message will be sent
  //that will be used later 

  @Get('/direct_messaging/@me/:id')
  @UseGuards(userRoomSubscriptionGuard)
  async findAllDm (@Req() request : Request,  @Param("id") room : string, @Query("init") init : string)
  {
    const allRoomMessages = await this.chatCrud.retrieveRoomMessages(room)
    const dmUsers = await this.chatCrud.retrieveUserDmChannels (request.cookies["user.id"])
  
    return { dmUser : dmUsers, roomsMesg : allRoomMessages, new_init : init}
  }



  ///////////////////////////////////////////////////////////
  //-                 Channel controllers                 -//
  ///////////////////////////////////////////////////////////

  @Post ("channels/createChannel")
  async createChannel (@Req() req :any,  @Body() channelData : channelDto, @Res() response)
  {
    const channel_id = await this.chatCrud.createChannel(req.cookies["user.id"], channelData)//check if channel succesfully created 
    response.redirect (`/chat/channels/@me/${channel_id}`)
  
  }

  //when the user creates a channel we should make him join the ws channel too
  //so we gonna need a way to tell if it is routed from create channel
  @Get ('channels/@me/:id')
  async findAllChannels (@Req() request : Request,  @Param("id") room : string)
  {
    const allRoomMessages = await this.chatCrud.retrieveRoomMessages(room)
    const channels = await this.chatCrud.findAllJoinedChannels (request.cookies["user.id"])
  
    return { dmUser : channels, roomsMesg : allRoomMessages}
  }


}
