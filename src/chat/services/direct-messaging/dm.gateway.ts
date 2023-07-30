import { WebSocketGateway, SubscribeMessage, WebSocketServer, 
  OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { DmService } from './dm.service';
import { CreateMessageDto } from '../../dto/create-chat.dto';
import { inboxPacketDto } from '../../dto/userInbox.dto';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class dmGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly dmService:DmService) {}

  //When the user connects to websocket it will be passed the id of the user 
  //to use it to create an inbox of notifications and new dm's to be initiated
  handleConnection(client: any, ...args: any[]) {
    console.log ('user connected\n')
    const user_id = client.handshake.query.id
    const inbox_id = "inbox-".concat(user_id)
    client.join (inbox_id)
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



  private async handleSendMesDm(client: any,  message:CreateMessageDto ) {
    this.server.to("dm-"+message.dm_id).emit('message', message.content)
  }

  //this method will be triggered right after dekiver_to_inbox right after the client get the dm room id
  @SubscribeMessage ("joinDm")
  handleJoinDm(client: any,  dm_id:string ) {
    client.join(`dm-${dm_id}`)
  }


  //this method serves as a postman to inbox destination
  @SubscribeMessage('toInbox')
  deliver_to_inbox (client: Socket, packet: inboxPacketDto)
  {
    //here I will send you the room  you must join
      this.server.to(packet.inbox_id).emit('inboxMsg', "hello")
      //when the inboxMsg is triggered it will fire an event to client side
      // the right client will receive that event and will trigger the joinDm 
      //function wich will make him join the common room , the Dm room where 
      //the real messaging will happen
  }


}
