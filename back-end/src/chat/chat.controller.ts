import { Controller, Get,Post , Res,Req,  Param, Inject, UseGuards, Body, Put, InternalServerErrorException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DmService } from './services/direct-messaging/dm.service';
import { Request, Response, response } from "express"
import { dmGateway } from './services/direct-messaging/dm.gateway';
import {  allowJoinGuard } from './guards/chat.guards';
import { channelMembershipDto, dmDto } from './dto/chat.dto';
import { Reflector } from '@nestjs/core';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import * as path from 'path';
import * as fs from 'fs';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';




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
  console.log('=======discussions: ', discussions)
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
  async findRoomMessages (@Req() request : Request, @Param("roomid") roomid:string)
  {
    return await this.chatCrud.retrieveRoomMessages(request.cookies["user.id"], roomid);
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
    return bannedRoomsData;
  }


 @Get ("/Channels/MuteRooms")
 async findMutenedRoomsChannels (@Req() request : Request)
 {

   const mutedRooms = await this.chatCrud.findMutedChannelsRooms(request.cookies["user.id"])
   const mutedRoomsData = mutedRooms.map( (item)=>{
       return ({room_id : item.channel_id})
   })
   return mutedRoomsData;
 }

 @Get("/userData")
 async getUserData (@Req() request : Request)
 {
   return (this.userCrud.findUserSessionDataByID(request.cookies["user.id"]))
 }


 @Post('upload')
 @UseInterceptors(FileInterceptor('file'))
 uploadFile(@UploadedFile() file) {
   if (!file) {
     return { message: 'No file uploaded' };
   }
   file.filename = uuidv4() + file.originalname;
 
   const filePath = path.join(__dirname, '..', '../upload/', file.filename);
 
   // Save the file to the server
   fs.writeFileSync(filePath, file.buffer);
 
   return { message: 'File uploaded and saved on the server', imageSrc: file.filename };
 }
 

 @Get("/memberCondidatesOfChannelCreation")
 async getFriends (@Req() request : Request)
 {
   return (await this.userCrud.findFriendsUsernameAvatar(request.cookies["user.id"]))
 }

 
@Put("/messages/markAsRead")
async markMessagesAsRead (@Req() request : Request, @Body() room : {_id:string})
{

  await this.chatCrud.markRoomMessagesAsRead(request.cookies['user.id'], room._id) //mark the messages that unsent by this user as read
}


@UseGuards(allowJoinGuard)
@Post("/channelJoinRequest")
async handleChannelJoinRequest (@Req() request : Request,
                       @Res() response: Response,
                       @Body() channelRequestMembership : {channel_id:string, password:string, type: 'PROTECTED' | 'PRIVATE' | 'PUBLIC' })
{
  const channelMembershipData: channelMembershipDto = {
    channel_id: channelRequestMembership.channel_id,
    user_id: request.cookies['user.id'],
    role: 'USER',
  };

  await this.chatCrud.joinChannel(channelMembershipData);
  return response.status(200).send('Channel join request is valid!');;
}
 


  ///////////////////////////////////////////////////////////
  //-                                  -//
  ///////////////////////////////////////////////////////////


  @Get("/channels_users_inits")
  async findUserAndChannelToJoin(@Req() request : Request)
  {
    const channelsToJoin = await this.chatCrud.findAllChannelsAvailbleToJoin(request.cookies['user.id'])
    const dmsToJoin = await this.chatCrud.findAllDmsAvailbleToJoin(request.cookies['user.id'])
    return ({channelsToJoin:channelsToJoin, dmsToJoin:dmsToJoin})
  }

  
  @Get("/DirectMessaging/CreateDm/:username")
  async createDmRoom(@Req() request : Request, 
                @Res() response : Response,
              @Param('username') username:string)
  {
    const userToContact = await this.userCrud.findUserByUsername(username);
    const dmData:dmDto = {
      user1_id : request.cookies['user.id'],
      user2_id :  userToContact,
      status : "ALLOWED"
    }
    const dm = await this.chatCrud.createDm(dmData);
    return response.status(200).send({dm_id: dm, userToContact: userToContact});

  }


  @Get("/DirectMessaging/getPartner/:dm_id")
  async getPartner(@Req() request : Request, @Param('dm_id') dm_id:string)
  {
    const partner = await this.chatCrud.findDmPartnerId(dm_id, request.cookies['user.id']);
    return partner;
  }

}
