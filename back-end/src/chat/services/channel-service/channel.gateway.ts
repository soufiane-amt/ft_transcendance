import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Roles } from "src/chat/decorators/chat.decorator";
import { MessageDto, UserBanMuteSignalDto, banManageSignalDto, channelCreateDto, channelDto, channelMembershipDto, channelReqDto, kickSignalDto, setOwnerSignalDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip, UserRoleSignal } from "src/chat/dto/update-chat.dto";
import { Role } from "src/chat/enum/role.enum";
import {  LeaveChannelGuard, allowJoinGuard, bannedConversationGuard, channelPermission, muteConversationGuard, userRoomSubscriptionGuard } from "src/chat/guards/chat.guards";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
import * as cookie from 'cookie';
import * as bcrypt from 'bcryptjs';
import socketIOMiddleware, { wsmiddleware } from "src/game/gateways.middleware";
import { GatewaysGuard } from "src/game/guards/gateways.guard";
import { GameService } from "src/game/game.service";
import ClientSocket from "src/game/interfaces/clientSocket.interface";

 
@UseGuards(GatewaysGuard)
@WebSocketGateway({namespace:"chat", cors: "*" })

 export class channelGateway implements OnGatewayConnection
 {
    @WebSocketServer ()
    server:Server

    constructor (private readonly chatCrud :ChatCrudService,
          private readonly gameservice: GameService,
         private readonly userCrud :UserCrudService){}

    async afterInit(server: Server) {
      const wsmidware: wsmiddleware = await socketIOMiddleware(this.gameservice);
      server.use(wsmidware);
    }
      
      
    async handleConnection(client : ClientSocket, ...args: any[]) {
      const userIdCookie = client.userId;
      console.log ('userIdCookie', userIdCookie)
      if (!userIdCookie)
        return
      if (await this.userCrud.findUserByID(userIdCookie) == null)
        throw new WsException ("User not existing");
        (await this.chatCrud.findAllJoinedChannels(userIdCookie)).forEach(room => {
          if (!room.is_banned)
            client.join(`channel-${room.channel_id}`)
        });
      }

      // private (client:Socket) {
      //   const headers = client.handshake.headers;
      //   const parsedCookies = cookie.parse(headers.cookie || "");
      //   return parsedCookies["user.id"];
      // }
      
      private async hashPassword(password: string): Promise<string> {
        try {
          // Generate a salt (a random string) to make the hash unique
          const salt = await bcrypt.genSalt(10);
        
          // Hash the password with the generated salt
          const hashedPassword = await bcrypt.hash(password, salt);
        
          return hashedPassword;
        } catch (error) {
          // Handle any errors here
          throw new Error('Password hashing failed');
        }
      }
  
  

    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('updateChannelType')
    async changeChannelType (client :ClientSocket, updateType : UpdateChannelDto)
    {
      await this.chatCrud.changeChannelType (updateType.channel_id, updateType.type, updateType.password)
    }


    
    @UseGuards(allowJoinGuard) 
    @SubscribeMessage('joinSignal')
    async handleJoinChannel ( client : ClientSocket, channel_id:string)//this event is only triggered by the users that will join not the admin that already joined and created channel
    {
      const user_id = client.userId;
      
      const channel_data =  await this.chatCrud.getChannelData (channel_id);
      const userPublicData =  await this.userCrud.findUserSessionDataByID(user_id);

      this.server.to(`channel-${channel_id}`).emit('updateUserContact', {id:userPublicData.id,
        username: userPublicData.username, 
        avatar: userPublicData.avatar, 
      })
      
      this.server.to(`inbox-${user_id}`).emit('joinChannel', 
        {id:channel_data.id, 
        name: channel_data.name, 
        image: channel_data.image, 
        type:channel_data.type
      })
      this.broadcastChannelChanges(channel_id)
    }


    
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
    async handleChannelBan(client : ClientSocket,  banSignal:UserBanMuteSignalDto ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(banSignal.target_username)
      const  minutesToMilliseconds = (minutes: number) => {
        return minutes * 60 * 1000; 
      }
    

      const banData = {
          user_id :targeted_user_id,
          channel_id : banSignal.channel_id,
          banDuration : minutesToMilliseconds(banSignal.actionDuration)
        }
      await this.chatCrud.blockAUserWithinGroup(banData)
        this.server
        .to(`inbox-${targeted_user_id}`)
        .emit("userBanned", { room_id: banSignal.channel_id, agent_id: '' });

        this.broadcastChannelChanges(banData.channel_id)
    }  
 
    
    @Roles (Role.OWNER, Role.ADMIN)
    @UseGuards(channelPermission)  
    @SubscribeMessage ("channelUserUnBan")
    async handleChannelUnBan( client :ClientSocket, unbanSignal:UserBanMuteSignalDto ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(unbanSignal.target_username)
      await this.chatCrud.unblockAUserWithinGroup(targeted_user_id, unbanSignal.channel_id)
      this.broadcastChannelChanges(unbanSignal.channel_id)
      this.server.to(`inbox-${targeted_user_id}`).emit('userUnBanned', {room_id: unbanSignal.channel_id, agent_id:'' })
    }  


    @SubscribeMessage ("channelUserMute")
    async handleChannelMute(client : ClientSocket,  muteSignal:UserBanMuteSignalDto ) 
    {
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

    @Roles (Role.OWNER, Role.ADMIN)
    @UseGuards(channelPermission)  
    @SubscribeMessage ("channelUserUnMute")
    async handleChannelUnMute( client :ClientSocket, unmuteSignal:UserBanMuteSignalDto ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(unmuteSignal.target_username)
      await this.chatCrud.unmuteAUserWithinGroup(targeted_user_id, unmuteSignal.channel_id)
      this.broadcastChannelChanges(unmuteSignal.channel_id)
      this.server.to(`inbox-${targeted_user_id}`).emit('userUnMuted', {room_id: unmuteSignal.channel_id })
    }  


    @SubscribeMessage ("suspendChannelUpdates")
    async handleSuspendChannelUpdates (client : ClientSocket, channel_id:string)
    {
      client.leave (`channel-${channel_id}`)
    }

    @UseGuards(bannedConversationGuard)
    @UseGuards(muteConversationGuard)
    @UseGuards (userRoomSubscriptionGuard)  
    @SubscribeMessage ("resumeChannelUpdates") //A gard must be added to check if the user has the right to request to unmute him
    async handleResumeChannelUpdates (client : ClientSocket, channel_id:string)
    {
      console.log ('4')
      client.join (`channel-${channel_id}`)
      this.broadcastChannelChanges(channel_id)
    }


    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('upgradeMemberToAdmin')
    async upgradeUserToAdmin (client :ClientSocket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.upgradeToAdmin (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }

    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage('setAdminToMember')
    async upgradeAdminToUser (client :ClientSocket, upgradeSignal : UserRoleSignal)
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(upgradeSignal.targeted_username)
      await this.chatCrud.setGradeToUser (targeted_user_id, upgradeSignal.channel_id)
      this.broadcastChannelChanges(upgradeSignal.channel_id)
    }

    @Roles (Role.OWNER, Role.ADMIN)
    @UseGuards(channelPermission)
    @SubscribeMessage ("kickOutUser")
    async handleChannelKicks(client : ClientSocket,  kickSignal:kickSignalDto ) 
    { 
      const targeted_user_id = await this.userCrud.findUserByUsername(kickSignal.target_username)
      await this.chatCrud.leaveChannel (targeted_user_id, kickSignal.channel_id) //deleting the membership of the client in DB
      this.server.to(`inbox-${targeted_user_id}`).emit('kickOutNotification', kickSignal.channel_id)
      this.broadcastChannelChanges(kickSignal.channel_id)
    }


    @UseGuards(LeaveChannelGuard)
    @SubscribeMessage ("leaveChannel")
    async handleChannelLeave(client : ClientSocket,  channel_id : string  ) 
    { 
      const user_id =  client.userId;
      client.leave (`channel-${channel_id}`)                              //Deleting the user from the websocket room
      const delete_channel = await this.chatCrud.leaveChannel (user_id, channel_id) //deleting the membership of the client in DB
      this.server.to(`inbox-${user_id}`).emit('LeaveOutNotification', channel_id)
      if (!delete_channel) //if the user was the owner of the channel  
        this.broadcastChannelChanges(channel_id)
    }

  
    @Roles (Role.OWNER)
    @UseGuards(channelPermission)
    @SubscribeMessage ("setOwner")
    async handleGradeUserTOwner(client : ClientSocket,  setOwnerSignal : setOwnerSignalDto  ) 
    {
      const targeted_user_id = await this.userCrud.findUserByUsername(setOwnerSignal.targeted_username)
      await this.chatCrud.makeOwner (targeted_user_id, setOwnerSignal.channel_id) 
    }  
 

    @UseGuards(bannedConversationGuard)
    @UseGuards(muteConversationGuard)
    @UseGuards (userRoomSubscriptionGuard)  
    @SubscribeMessage ("sendMsg")
    async handleSendMesChannels(client : ClientSocket,  message:MessageDto ) 
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


  
    
    @SubscribeMessage ("createChannel")
    async handleCreateChannel ( client : ClientSocket, channelData : channelCreateDto)
    {
      console.log ('channelData', channelData)
      const userIdCookie = client.userId;
      if (!userIdCookie)
        return
      const channel_data :channelDto = {
        name : channelData.channelName,
        type : channelData.channelType,
        password : await this.hashPassword(channelData.password),
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

    }
  
}