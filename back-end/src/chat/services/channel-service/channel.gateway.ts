import { UseGuards } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Roles } from "src/chat/decorators/chat.decorator";
import { MessageDto, banManageSignalDto, channelMembershipDto, channelReqDto, kickSignalDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip } from "src/chat/dto/update-chat.dto";
import { Role } from "src/chat/enum/role.enum";
import {  allowJoinGuard, bannedConversationGuard, channelPermission, userRoomSubscriptionGuard } from "src/chat/guards/chat.guards";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
import * as cookie from 'cookie';

 

@WebSocketGateway({namespace:"chat", cors: "*" })

 export class channelGateway implements OnGatewayConnection
 {
    @WebSocketServer ()
    server:Server

    constructor (private readonly chatCrud :ChatCrudService,
         private readonly userCrud :UserCrudService){}

    async handleConnection(client: any, ...args: any[]) {
      const headers = client.handshake.headers;
      // // Parse the cookies from the request headers
      const parsedCookies = cookie.parse(headers.cookie || '');
       
      // // Access specific cookies by name
      const userIdCookie = parsedCookies["user.id"];
      console.log ("Cookies: ", userIdCookie)
      if (!userIdCookie)
        return
      if (await this.userCrud.findUserByID(userIdCookie) == null)
        throw new WsException ("User not existing")
          console.log (`user ${userIdCookie} connected\n`);
        (await this.chatCrud.findAllJoinedChannels(userIdCookie)).forEach(room => {
          console.log ("user : " + userIdCookie + " joined " + room.channel_id)
          client.join(`channel-${room.channel_id}`)
        });
      }

    //check if the user exists
    //check if the user has permissions 
    // @Roles(Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    // @SubscribeMessage ('updateChannelPic')
    // async changeChannelPhoto (client :Socket, updatePic : UpdateChannelDto)
    // {
    //     await this.chatCrud.changeChannelPhoto (updatePic.channel_id, updatePic.image)
    // }

    // @SubscribeMessage('updateChannelType')
    // @Roles (Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    // async changeChannelType (client :Socket, updateType : UpdateChannelDto)
    // {
    //     await this.chatCrud.changeChannelType (updateType.channel_id, updateType.type, updateType.password)
    // }

    // @SubscribeMessage('updateChannelName')
    // @Roles (Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    // async changeChannelName (client :Socket, updateType : UpdateChannelDto)
    // {
    //     await this.chatCrud.changeChannelName (updateType.channel_id, updateType.name)
    // }

    // @Roles (Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    // @SubscribeMessage('upUserToAdmin')
    // async upgradeUserToAdmin (client :Socket, updateUserM : UpdateUserMemberShip)
    // {
    //     await this.chatCrud.upgradeToAdmin (updateUserM.user_id, updateUserM.channel_id)
    // }

    // @SubscribeMessage('joinSignal')
    // //check if the user exists
    // //check the exitence of the channel
    // //Check if the data sent to the channel is actually 
    // //comptible with the requirement of the channel .e.g (protected has to have password ... )
    // @UseGuards(allowJoinGuard) 
    // async handleJoinChannel (client :Socket, membReq : channelReqDto)//this event is only triggered by the users that will join not the admin that already joined and created channel
    // {
    //   console.log ("Passed")
    //   const channelMembership:channelMembershipDto =  {channel_id: membReq.channel_id, user_id: membReq.user_id, role:'USER'}
    //   await this.chatCrud.joinChannel (channelMembership)
    //   client.join(membReq.channel_id)
    // }


    // //User Moderation :
    // //Kicking or banning a user can only be done by the owner or admin 
    // //the admin cannot ban/kick the owner or an other admin 
    // //the user cannot ban or kick other memebers

    // @UseGuards(allowJoinGuard) 
    // @Roles (Role.OWNER, Role.ADMIN)
    // @SubscribeMessage ("channelUserBanModerate")
    // async handleChannelBan(client: any,  banSignal:banManageSignalDto ) 
    // {
    //   if (banSignal.type == "BAN")
    //     await this.chatCrud.blockAUserWithinGroup(banSignal.user_id, banSignal.channel_id)
    //   else
    //     await this.chatCrud.unblockAUserWithinGroup (banSignal.user_id, banSignal.channel_id)
    // }  


    // @UseGuards(allowJoinGuard) 
    // @Roles (Role.OWNER, Role.ADMIN)
    // @SubscribeMessage ("kickOutUser")
    // async handleChannelKicks(client: any,  kickSignal:kickSignalDto ) 
    // {
    //   await this.chatCrud.leaveChannel (kickSignal.user_id, kickSignal.channel_id) //deleting the membership of the client in DB
    //   client.leave (kickSignal.channel_id)                                        //Deleting the user from the websocket room
    // }  


    // //check if the user is not banned 
    // //user must have membership
    // @UseGuards (userRoomSubscriptionGuard)
    // @UseGuards(bannedConversationGuard)
    @SubscribeMessage ("sendMsg")
    async handleSendMesDm(client: any,  message:MessageDto ) 
    {
      message.dm_id = null;
      const messageToBrodcast = await this.chatCrud.createMessage(message)
      this.server.to(`channel-${message.channel_id}`).emit('newMessage', messageToBrodcast)
    }

    @SubscribeMessage("recordVisit")
    async handleVisitRecord(client: any , visitSignal: {user_id:string, channel_id: string} ) 
    {
      await this.chatCrud.markRoomMessagesAsRead(visitSignal.user_id, visitSignal.channel_id)
    }
}