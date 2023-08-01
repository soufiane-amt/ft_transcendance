import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "socket.io";
import { banManageSignalDto, channelMembershipDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip } from "src/chat/dto/update-chat.dto";
import { ChatCrudService } from "src/prisma/prisma/chat-crud.service";

 

 @WebSocketGateway()

 export class channelGateway
 {
    @WebSocketServer ()
    server:Server

    constructor (private readonly chatCrud :ChatCrudService){}

    @SubscribeMessage ('updateChannelPic')
    //check if the user exists
    //check if the user has permissions 
    async changeChannelPhoto (client :Socket, updatePic : UpdateChannelDto)
    {
        await this.chatCrud.changeChannelPhoto (updatePic.channel_id, updatePic.image)
    }

    @SubscribeMessage('updateChannelType')
    //check if the user exists
    //check if the user has permissions 
    async changeChannelType (client :Socket, updateType : UpdateChannelDto)
    {
        await this.chatCrud.changeChannelType (updateType.channel_id, updateType.type, updateType.password)
    }

    @SubscribeMessage('updateChannelName')
    //check if the user exists
    //check if the user has permissions 
    async changeChannelName (client :Socket, updateType : UpdateChannelDto)
    {
        await this.chatCrud.changeChannelName (updateType.channel_id, updateType.name)
    }

    //only the admin or the owner can set other regular users as admins 
    //check if the updgraded is not already an admin or owner
    @SubscribeMessage('upUserToAdmin')
    async upgradeUserToAdmin (client :Socket, updateUserM : UpdateUserMemberShip)
    {
        await this.chatCrud.upgradeToAdmin (updateUserM.user_id, updateUserM.channel_id)
    }

    @SubscribeMessage('joinSignal')
    //check if the user exists
    //Check if the data sent to the channel is actually 
    //comptible with the requirement of the channel .e.g (protected has to have password ... )
    async joinChannel (client :Socket, membReq : channelMembershipDto)
    {
        await this.chatCrud.joinChannel (membReq)
    }

    @SubscribeMessage ("channelUserModerate")
    handleChannelBan(client: any,  banSignal:banManageSignalDto ) 
    {
      if (banSignal.type == "BAN")
        this.chatCrud.blockAUserWithinGroup(banSignal.user_id, banSignal.channel_id)
      else
        this.chatCrud.unblockAUserWithinGroup (banSignal.user_id, banSignal.channel_id)
    }  
  

}