import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "socket.io";
import { UpdateChannelDto } from "src/chat/dto/update-chat.dto";
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

}