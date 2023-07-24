import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { DmService } from './dm.service';
import { CreateMessageDto } from '../../dto/create-chat.dto';
import { UpdateChatDto } from '../../dto/update-chat.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class dmGateway {
  @WebSocketServer()
  server :Server

  constructor(private readonly DmService: DmService) {}

  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    this.DmService.create(createMessageDto);
    console.log ("status:"+ createMessageDto.is_read)
    return (createMessageDto)
  }
  
  @SubscribeMessage('join')
  handleJoinRoom(client: any, room: string): void {
    client.join(room);
    this.server.to(room).emit('message', `User joined room: ${room}`);
  }
  
  @SubscribeMessage('sendChannel')
  handleMessageRoom(client: any, playload: {room:string, message:string} ): void {
    this.server.to(playload.room).emit('message', playload.message);
  }

  @SubscribeMessage('dmMessage')
  send_message (client: any, message: CreateMessageDto)
  {

    client.emit('message', message)
  }
//   @SubscribeMessage('findAllChat')
//   findAll() {
//     return this.DmService.findAll();
//   }

//   @SubscribeMessage('updateChat')
//   update(@MessageBody() updateChatDto: UpdateChatDto) {
//     return this.DmService.update(updateChatDto.id, updateChatDto);
//   }

//   @SubscribeMessage('removeChat')
//   remove(@MessageBody() id: number) {
//     return this.DmService.remove(id);
//   }
}
