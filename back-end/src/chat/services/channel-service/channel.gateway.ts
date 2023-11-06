import { UseGuards } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Roles } from "src/chat/decorators/chat.decorator";
import { MessageDto, UserBanMuteSignalDto, banManageSignalDto, channelCreateDto, channelDto, channelMembershipDto, channelReqDto, kickSignalDto, setOwnerSignalDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip, UserRoleSignal } from "src/chat/dto/update-chat.dto";
import { Role } from "src/chat/enum/role.enum";
import {  allowJoinGuard, bannedConversationGuard, channelPermission, muteConversationGuard, userRoomSubscriptionGuard } from "src/chat/guards/chat.guards";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
import * as cookie from 'cookie';
import { channel, subscribe } from "diagnostics_channel";

 

@WebSocketGateway({namespace:"chat", cors: "*" })

 export class channelGateway implements OnGatewayConnection
 {
    @WebSocketServer ()
    server:Server

    constructor (private readonly chatCrud :ChatCrudService,
         private readonly userCrud :UserCrudService){}

    async handleConnection(client: any, ...args: any[]) {
      const userIdCookie = this.extractUserIdFromCookies(client);
      if (!userIdCookie)
        return
      if (await this.userCrud.findUserByID(userIdCookie) == null)
        throw new WsException ("User not existing");
        (await this.chatCrud.findAllJoinedChannels(userIdCookie)).forEach(room => {
          if (!room.is_banned)
            client.join(`channel-${room.channel_id}`)
        });
      }

      private extractUserIdFromCookies(client:Socket) {
        const headers = client.handshake.headers;
        const parsedCookies = cookie.parse(headers.cookie || "");
        return parsedCookies["user.id"];
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

    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('updateChannelType')
    async changeChannelType (client :Socket, updateType : UpdateChannelDto)
    {
      console.log ('Update type : ', updateType)
      await this.chatCrud.changeChannelType (updateType.channel_id, updateType.type, updateType.new_password)
    }


    
    @UseGuards(allowJoinGuard) 
    @SubscribeMessage('joinSignal')
    async handleJoinChannel (client :Socket, channel_id:string)//this event is only triggered by the users that will join not the admin that already joined and created channel
    {
      const user_id = this.extractUserIdFromCookies(client);
      // const channelMembership:channelMembershipDto =  {channel_id: membReq.channel_id,
      //   user_id: user_id,
      //   role:'USER'}
      const channel_data =  await this.chatCrud.getChannelData (channel_id);
      console.log (']]]]]]]>>>Join signal : ', channel_data)
      this.server.to(`inbox-${user_id}`).emit('joinChannel', 
        {id:channel_data.id, 
        name: channel_data.name, 
        image: channel_data.image, 
        type:channel_data.type
      })
    }


    // //User Moderation :
    // //Kicking or banning a user can only be done by the owner or admin 
    // //the admin cannot ban/kick the owner or an other admin 
    // //the user cannot ban or kick other memebers

    // @UseGuards(allowJoinGuard) 
    // @Roles (Role.OWNER, Role.ADMIN)
    
    async broadcastExpiration(channel_id: string, user_id: string, type: 'BAN' | 'MUTE') {
      if (type === "BAN") {
        await this.chatCrud.unblockAUserWithinGroup(user_id, channel_id)
        this.server.to(`inbox-${user_id}`).emit('userUnBanned', {room_id: channel_id, agent_id:'' })
      }
      else if (type === "MUTE") {
        await this.chatCrud.unmuteAUserWithinGroup(user_id, channel_id)
        this.server.to(`inbox-${user_id}`).emit('userUnMuted', {room_id: channel_id })
      }
      this.broadcastChannelChanges(channel_id)
      }      


    @Roles (Role.OWNER, Role.ADMIN)
    @UseGuards(channelPermission)  
    @SubscribeMessage ("channelUserBan")
    async handleChannelBan(client: any,  banSignal:UserBanMuteSignalDto ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(banSignal.target_username)
      const  minutesToMilliseconds = (minutes: number) => {
        return minutes * 60 * 1000; 
      }

      const banData = {
          user_id :targeted_user_id,
          channel_id : banSignal.channel_id,
          banDuration : minutesToMilliseconds(banSignal.actionDuration)/6
        }
      await this.chatCrud.blockAUserWithinGroup(banData)
        this.server
        .to(`inbox-${targeted_user_id}`)
        .emit("userBanned", { room_id: banSignal.channel_id, agent_id: '' });

        this.broadcastChannelChanges(banData.channel_id)
    }  
 
    
    @SubscribeMessage ("channelUserUnBan")
    async handleChannelUnBan( client :Socket, unbanSignal:UserBanMuteSignalDto ) 
    {
      console.log ('Unban signal : ', unbanSignal)
      const targeted_user_id = await this.userCrud.findUserByUsername(unbanSignal.target_username)
      await this.chatCrud.unblockAUserWithinGroup(targeted_user_id, unbanSignal.channel_id)
      this.broadcastChannelChanges(unbanSignal.channel_id)
      this.server.to(`inbox-${targeted_user_id}`).emit('userUnBanned', {room_id: unbanSignal.channel_id, agent_id:'' })
    }  


    @SubscribeMessage ("channelUserMute")
    async handleChannelMute(client: any,  muteSignal:UserBanMuteSignalDto ) 
    {
      console.log ('Channel mute is received : ', muteSignal)
      const targeted_user_id = await this.userCrud.findUserByUsername(muteSignal.target_username)
      const  minutesToMilliseconds = (minutes: number) => {
        return minutes * 60 * 1000; 
      }

      const muteData = {
          user_id :targeted_user_id,
          channel_id : muteSignal.channel_id,
          muteDuration : minutesToMilliseconds(muteSignal.actionDuration)/6
        }
      await this.chatCrud.muteAUserWithinGroup(muteData)
        this.server
        .to(`inbox-${targeted_user_id}`)
        .emit("userMuted", { room_id: muteSignal.channel_id});

        this.broadcastChannelChanges(muteData.channel_id)
    }  

    @SubscribeMessage ("channelUserUnMute")
    async handleChannelUnMute( client :Socket, unmuteSignal:UserBanMuteSignalDto ) 
    {
      console.log ('unmute signal : ', unmuteSignal)
      const targeted_user_id = await this.userCrud.findUserByUsername(unmuteSignal.target_username)
      await this.chatCrud.unmuteAUserWithinGroup(targeted_user_id, unmuteSignal.channel_id)
      this.broadcastChannelChanges(unmuteSignal.channel_id)
      this.server.to(`inbox-${targeted_user_id}`).emit('userUnMuted', {room_id: unmuteSignal.channel_id })
    }  


    @SubscribeMessage ("suspendChannelUpdates")
    async handleSuspendChannelUpdates (client: any, channel_id:string)
    {
      console.log ('Suspend channel updates : ', channel_id)
      client.leave (`channel-${channel_id}`)
    }

    // @UseGuards(bannedConversationGuard)
    // @UseGuards(muteConversationGuard)
    @UseGuards (userRoomSubscriptionGuard)  
    @SubscribeMessage ("resumeChannelUpdates") //A gard must be added to check if the user has the right to request to unmute him
    async handleResumeChannelUpdates (client: any, channel_id:string)
    {
      console.log ('00000000000000000000 : ', channel_id)
      client.join (`channel-${channel_id}`)
    }


    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('upgradeMemberToAdmin')
    async upgradeUserToAdmin (client :Socket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.upgradeToAdmin (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }

    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('setAdminToMember')
    async upgradeAdminToUser (client :Socket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.setGradeToUser (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }

    @Roles (Role.OWNER, Role.ADMIN)
    @UseGuards(channelPermission)
    @SubscribeMessage ("kickOutUser")
    async handleChannelKicks(client: any,  kickSignal:kickSignalDto ) 
    { 
      const targeted_user_id = await this.userCrud.findUserByUsername(kickSignal.target_username)
      await this.chatCrud.leaveChannel (targeted_user_id, kickSignal.channel_id) //deleting the membership of the client in DB
      this.server.to(`inbox-${targeted_user_id}`).emit('kickOutNotification', kickSignal.channel_id)
      this.broadcastChannelChanges(kickSignal.channel_id)
    }


    @SubscribeMessage ("leaveChannel")
    async handleChannelLeave(client: any,  channel_id : string  ) 
    { 
      const user_id =  this.extractUserIdFromCookies(client);
      client.leave (`channel-${channel_id}`)                              //Deleting the user from the websocket room
      const delete_channel = await this.chatCrud.leaveChannel (user_id, channel_id) //deleting the membership of the client in DB
      if (!delete_channel) //if the user was the owner of the channel  
        this.broadcastChannelChanges(channel_id)
    }

    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage ("setOwner")
    async handleGradeUserTOwner(client: any,  setOwnerSignal : setOwnerSignalDto  ) 
    {
      console.log ('++++++ Set owner signal : ', setOwnerSignal)
      const targeted_user_id = await this.userCrud.findUserByUsername(setOwnerSignal.targeted_username)
      await this.chatCrud.makeOwner (targeted_user_id, setOwnerSignal.channel_id) 
    }  
 

    // @UseGuards(bannedConversationGuard)
    // @UseGuards(muteConversationGuard)
    // @UseGuards (userRoomSubscriptionGuard)  
    @SubscribeMessage ("sendMsg")
    async handleSendMesChannels(client: any,  message:MessageDto ) 
    {
      console.log ('I got a new message!')
      message.dm_id = null;
      const messageToBrodcast = await this.chatCrud.createMessage(message)
      this.server.to(`channel-${message.channel_id}`).emit('newMessage', messageToBrodcast)
    }

    private async broadcastChannelChanges(channel_id:string)
    {
      const channelNewData = {
        channelUsers: await this.chatCrud.findChannelUsers(channel_id),
        channelOwner: await this.chatCrud.findChannelOwner(channel_id),
        channelAdmins: await this.chatCrud.findChannelAdmins(channel_id),
        channelBans: await this.chatCrud.retieveBlockedChannelUsers(channel_id),
        channelMutes: await this.chatCrud.retieveMutedChannelUsers(channel_id),
      }
      this.server.to(`channel-${channel_id}`).emit('updateChannelData', channel_id, channelNewData)
    }


    
// export interface channelDto {
//   type: "PUBLIC" | "PRIVATE" | "PROTECTED";
//   name: string;
//   image: string;
//   password?: string;
// }
    @SubscribeMessage ("createChannel")
    async handleCreateChannel (client :Socket, channelData : channelCreateDto)
    {
      const userIdCookie = this.extractUserIdFromCookies(client);
      if (!userIdCookie)
        return
      const channel_data :channelDto = {
        name : channelData.channelName,
        type : channelData.channelType,
        password : channelData.password,
        image : `http://localhost:3001/chat/image/${channelData.imageSrc}`
      };
 
      const channel = await this.chatCrud.createChannel (userIdCookie, channel_data,  channelData.invitedUsers)
      for (let i = 0; i < channel.memberUsersIds.length; i++) {
        this.server.to(`inbox-${channel.memberUsersIds[i]}`)
          .emit('joinChannel', {id:channel.id, 
            name: channel_data.name, 
            image: channel_data.image, 
            type:channel_data.type
          })
      } 
      // this.server.to(`inbox-${userIdCookie}`).emit('joinChannel', {room_id:channel_id} )
      // client.('channel-' + channel_id)
    }

    //This method takes the image sent by the front end and store in the upload folder and database
    // @SubscribeMessage('uploadImage')
    // private handleUploadImage(channel_id :string, channel_image: {content : string | ArrayBuffer | null, extension: string}) {
    //     if (channel_image.content) {
    //       // Extract the Base64-encoded content from the data URL
    //       const base64Data = channel_image.content.toString();
    //       console.log('Base64 data : ', base64Data)
    //       // Create the image path
    //       const imagePath = `upload/${channel_id}.${channel_image.extension}`;
      
    //       // Write the image to the file without specifying the encoding as 'base64'
    //       const fs = require('fs');
    //       fs.writeFile(imagePath, base64Data, (err: any) => {
    //         if (err) {
    //           console.log(err);
    //         }
    //       });
    //     }
    //   }
  
}