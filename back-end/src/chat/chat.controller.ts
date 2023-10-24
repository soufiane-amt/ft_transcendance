import { Controller, Get, Query,Post , Res,Req,  Param, Inject, UseGuards, Body, BadRequestException, ExecutionContext, CallHandler, SetMetadata, Put, InternalServerErrorException } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request, Response } from "express"
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { FriendShipExistenceGuard, cookieGuard, userRoomSubscriptionGuard } from './guards/chat.guards';
import { MessageDto, channelDto } from './dto/chat.dto';
import { Reflector } from '@nestjs/core';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import * as path from 'path';
import * as fs from 'fs';
import { UserCrudService } from 'src/prisma/user-crud.service';

  



@Controller('chat')
// @UseGuards(cookieGuard)
export class ChatController
{

  constructor (private readonly dmService :DmService, 
                    private readonly chatCrud : ChatCrudService,
                    private readonly userCrud : UserCrudService,

                    @Inject(dmGateway) private readonly dmGate : dmGateway, 
                    private readonly reflector: Reflector){}


@Get('/image/:image_path')
async getUserImage(@Param('image_path') image_path: string, @Res() res: Response) {
  const imagePath =  path.join(__dirname, '..', `../upload/${image_path}`); // Go up two directories to reach the workspace root
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }
  res.sendFile(imagePath);
}
  

@Get ("/Direct_messaging/discussionsBar")
async findAllDiscussionPartners (@Req() request : Request)
{
  const dms = await this.chatCrud.retreiveDmInitPanelData(request.cookies['user.id']);
  const unreadMessagesPromises = dms.map(async (dmElement) => {
    const unreadMessages = await this.chatCrud.getUnreadDmMessagesNumber(request.cookies['user.id'], dmElement.id);//get the number of messages unread and unsent by this user
    return { ...dmElement, unread_messages: unreadMessages };
  });

  // I wait for all promises to resolve
  const discussions = await Promise.all(unreadMessagesPromises);

  return discussions;
}
 
@Get ("/Channels/discussionsBar")
async findAllDiscussionChannels (@Req() request : Request)
{
  try {
  const channels = await this.chatCrud.retreiveChannelPanelsData(request.cookies['user.id']);
  const unreadMessagesPromises = channels.map(async (chElement) => {
    const unreadMessages = await this.chatCrud.getUnreadChannelMessagesNumber(request.cookies['user.id'], chElement.id);//get the number of messages unread and unsent by this user
    const channelOwner = await this.chatCrud.findChannelOwner(chElement.id)
    const channelUsers = await this.chatCrud.findChannelUsers(chElement.id)
    const channelAdmins = await this.chatCrud.findChannelAdmins(chElement.id)
    const channelBans = await this.chatCrud.retieveBlockedChannelUsers(chElement.id)
    const channelMutes = await this.chatCrud.retieveMutedChannelUsers(chElement.id)

    return { ...chElement, 
             unread_messages: unreadMessages, 
             channelUsers : channelUsers,
             channelOwner: channelOwner, 
             channelAdmins:channelAdmins,
             channelBans: channelBans,
             channelMutes: channelMutes
            };
  });

  // I wait for all promises to resolve
  const discussions = await Promise.all(unreadMessagesPromises);

  return discussions;
  } catch (error) {
  // Handle and log errors appropriately, avoid exposing sensitive information
  throw new InternalServerErrorException('An error occurred while fetching discussion channels.');
}

}


@Get ("/direct_messaging/userContactsBook")
async findAllUsersInContact (@Req() request : Request)
{
  const users = await this.chatCrud.retrieveUserContactBook (request.cookies["user.id"])
  
  return (users)
}

@Get ("/channels/userContactsBook")
async findAllUsersWithCommonChannels (@Req() request : Request)
{
  const users = await this.chatCrud.findUsersInCommonChannels (request.cookies["user.id"])
  return (users)
}

@Get ("/Channels/channelsInfoBook")
async findAllChannelsInContact (@Req() request : Request)
{
  const users = await this.chatCrud.retrieveUserChannelsBook (request.cookies["user.id"])
  return (users)
}

  @Get (":roomid/messages")
  async findRoomMessages (@Param("roomid") roomid:string)
  {
    console.log ('Got a request and here is the data : ', await this.chatCrud.retrieveRoomMessages(roomid))
    return await this.chatCrud.retrieveRoomMessages(roomid);
  }

  @Get ("/direct_messaging/bannedRooms")
  async findBannedRoomsDm (@Req() request : Request)
  {
    const bannedRooms = await this.chatCrud.findBannedDmRooms(request.cookies["user.id"])
    const bannedRoomsData = bannedRooms.map( (item)=>{
        return ({room_id : item.id, blocker_id: item.blocker_id})
    })
    return bannedRoomsData;
  } 

  @Get ("/Channels/bannedRooms")
  async findBannedRoomsChannels (@Req() request : Request)
  {

    const bannedRooms = await this.chatCrud.findBannedChannelsRooms(request.cookies["user.id"])
    const bannedRoomsData = bannedRooms.map( (item)=>{
        return ({room_id : item.channel_id, blocker_id: ''})
    })
    console.log ('Got a request and here is the data : ', bannedRoomsData)
    return bannedRoomsData;
  }


 @Get ("/Channels/MuteRooms")
 async findMutenedRoomsChannels (@Req() request : Request)
 {

   const mutedRooms = await this.chatCrud.findMutedChannelsRooms(request.cookies["user.id"])
   const mutedRoomsData = mutedRooms.map( (item)=>{
       return ({room_id : item.channel_id})
   })
   console.log ('Got a request and here is the data : ', mutedRoomsData)
   return mutedRoomsData;
 }

  @Get("/userData")
  async getUserData (@Req() request : Request)
  {
    return (this.userCrud.findUserSessionDataByID(request.cookies["user.id"]))
  }

 
@Put("/messages/markAsRead")
async markMessagesAsRead (@Req() request : Request, @Body() room : {_id:string})
{

  await this.chatCrud.markRoomMessagesAsRead(request.cookies['user.id'], room._id) //mark the messages that unsent by this user as read
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
