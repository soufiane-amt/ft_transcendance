import { UseGuards } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Roles } from "src/chat/decorators/chat.decorator";
import { MessageDto, UserBanMuteSignalDto, banManageSignalDto, channelMembershipDto, channelReqDto, kickSignalDto, setOwnerSignalDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip, UserRoleSignal } from "src/chat/dto/update-chat.dto";
import { Role } from "src/chat/enum/role.enum";
import {  allowJoinGuard, bannedConversationGuard, channelPermission, muteConversationGuard, userRoomSubscriptionGuard } from "src/chat/guards/chat.guards";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
import * as cookie from 'cookie';
import { subscribe } from "diagnostics_channel";

 

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

    // @Roles (Role.OWNER)
    // @UseGuards(channelPermission)
    @SubscribeMessage('updateChannelType')
    async changeChannelType (client :Socket, updateType : UpdateChannelDto)
    {
      console.log ('Update type : ', updateType)
      await this.chatCrud.changeChannelType (updateType.channel_id, updateType.type, updateType.new_password)
    }

    // @SubscribeMessage('updateChannelName')
    // @Roles (Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    // async changeChannelName (client :Socket, updateType : UpdateChannelDto)
    // {
    //     await this.chatCrud.changeChannelName (updateType.channel_id, updateType.name)
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
      client.leave (`channel-${channel_id}`)
    }

    @SubscribeMessage ("resumeChannelUpdates") //A gard must be added to check if the user has the right to request to unmute him
    async handleResumeChannelUpdates (client: any, channel_id:string)
    {
      client.join (`channel-${channel_id}`)
    }


    // @Roles (Role.OWNER, Role.ADMIN)
    // @UseGuards(channelPermission)
    @SubscribeMessage('upgradeMemberToAdmin')
    async upgradeUserToAdmin (client :Socket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.upgradeToAdmin (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }
    @SubscribeMessage('setAdminToMember')
    async upgradeAdminToUser (client :Socket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.setGradeToUser (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }

    // @UseGuards(allowJoinGuard) 
    // @Roles (Role.OWNER, Role.ADMIN)
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
      await this.chatCrud.leaveChannel (user_id, channel_id) //deleting the membership of the client in DB
      this.broadcastChannelChanges(channel_id)
      client.leave (`channel-${channel_id}`)                              //Deleting the user from the websocket room
    }  

    @SubscribeMessage ("setOwner")
    async handleGradeUserTOwner(client: any,  setOwnerSignal : setOwnerSignalDto  ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(setOwnerSignal.targeted_username)
      await this.chatCrud.makeOwner (targeted_user_id, setOwnerSignal.channel_id) 
    }  
 

    @UseGuards(bannedConversationGuard)
    @UseGuards(muteConversationGuard)
    @UseGuards (userRoomSubscriptionGuard)  
    @SubscribeMessage ("sendMsg")
    async handleSendMesDm(client: any,  message:MessageDto ) 
    {
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
}