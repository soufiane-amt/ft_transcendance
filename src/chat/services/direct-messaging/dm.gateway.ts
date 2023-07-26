import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { DmService } from './dm.service';
import { CreateMessageDto } from '../../dto/create-chat.dto';
import { UpdateChatDto } from '../../dto/update-chat.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class dmGateway {
  @WebSocketServer()
  server :Server

  constructor() {}
  
  @SubscribeMessage('join')
  handleJoinDm(client: any, room: string): void { 
    client.join(room);
    this.server.to(room).emit('message', `User joined room: ${room}`);
  }


  @SubscribeMessage('sendChannel')
  handleMessageDm(client: any, playload: {room:string, message:string} ): void {
    this.server.to(playload.room).emit('message', playload.message);
  }

}
