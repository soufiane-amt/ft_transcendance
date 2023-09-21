import { WebSocketGateway, SubscribeMessage, WebSocketServer, 
  OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';

import { DmService } from './dm.service';
import { MessageDto, banManageSignalDto } from '../../dto/chat.dto';
import { inboxPacketDto } from '../../dto/userInbox.dto';
import { Server, Socket } from 'socket.io';
import {  bannedConversationGuard, userRoomSubscriptionGuard } from 'src/chat/guards/chat.guards';
import { UseGuards } from '@nestjs/common';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import * as cookie from 'cookie';



@WebSocketGateway({namespace:"chat/dm"})
export class dmGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly dmService:DmService, 
    private readonly userCrud :UserCrudService, private readonly chatCrud :ChatCrudService) {}

  //When the user connects to websocket it will be passed the id of the user 
  //to use it to create an inbox of notifications and new dm's to be initiated
  
  async handleConnection(client: any, ...args: any[]) {
    const headers = client.handshake.headers;

    // Parse the cookies from the request headers
    const parsedCookies = cookie.parse(headers.cookie || '');
  
    // Access specific cookies by name
    const userIdCookie = parsedCookies["user.id"];
    if (await this.userCrud.findUserByID(userIdCookie) == null)
      throw new WsException ("User not existing")
    console.log (`user ${userIdCookie} connected\n`)
    const inbox_id = "inbox-".concat(userIdCookie)
    client.join (inbox_id);
    (await this.chatCrud.retrieveUserDmChannels(userIdCookie)).forEach(room => {
      client.join("dm-"+room.id)
    });
    
  }

  handleDisconnect(client: any) {
    // This method is triggered when a user disconnects from the WebSocket server
    console.log(`User disconnected: ID=${client.id}`);
  }



  @SubscribeMessage('joinInbox')
  handleJoinInbox(client: Socket, inbox_id: string): void { 
    console.log (`${client.id} is connected to ${inbox_id}`)
    client.join(inbox_id);
  }


  //this method serves as a postman to inbox destination
  @SubscribeMessage('toInbox')
  deliver_to_inbox (client: Socket, packet: inboxPacketDto)
  {
    //here I will send you the room  you must join
    this.server.to(packet.inbox_id).emit('inboxMsg', "hello")
    this.server.to("inbox-" + packet.sender_id).emit('inboxMsg', "hello")
    //when the inboxMsg is triggered it will fire an event to client side
      // the right client will receive that event and will trigger the joinDm 
      //function wich will make him join the common room , the Dm room where 
      //the real messaging will happen
  }

  //this method will be triggered right after deliver_to_inbox right after the client get the dm room id
  @SubscribeMessage ("joinDm")
  handleJoinDm(client: any,  dm_id:string ) {
    client.join(dm_id)
  }  


  //In case 
  @UseGuards (userRoomSubscriptionGuard)
  @UseGuards (bannedConversationGuard)
  @SubscribeMessage ("sendMsgDm")
  handleSendMesDm(client: any,  message:MessageDto ) 
  {
    console.log ("----messge sent----")
    this.server.to(message.dm_id).emit('message', message.content)
  }  

  @UseGuards(userRoomSubscriptionGuard)
  @SubscribeMessage ("dmModeration")
  handleDmBan(client: any,  banSignal:banManageSignalDto ) 
  {
    if (banSignal.type == "BAN")
      this.chatCrud.blockAUserWithDm(banSignal.dm_id)
    else
      this.chatCrud.unblockAUserWithDm (banSignal.dm_id)
  }  





}
