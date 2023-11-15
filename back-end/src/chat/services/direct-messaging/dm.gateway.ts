import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";

import { MessageDto, banManageSignalDto } from "../../dto/chat.dto";
import { Server, Socket } from "socket.io";
import {
  bannedConversationGuard,
  userRoomSubscriptionGuard,
} from "src/chat/guards/chat.guards";
import { UseGuards } from "@nestjs/common";
import { UserCrudService } from "src/prisma/user-crud.service";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import * as cookie from "cookie";
import socketIOMiddleware, { wsmiddleware } from "src/game/gateways.middleware";
import { GameService } from "src/game/game.service";
import ClientSocket from "src/game/interfaces/clientSocket.interface";


@WebSocketGateway({ namespace: "chat", cors: "*" })
export class dmGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userCrud: UserCrudService,
    private readonly gameservice: GameService,
    private readonly chatCrud: ChatCrudService
  ) {}

  async afterInit(server: Server) {
    const wsmidware: wsmiddleware = await socketIOMiddleware(this.gameservice);
    server.use(wsmidware);
  }

  async handleConnection(client : ClientSocket, ...args: any[]) {
    const currentUserId = client.userId;
    console.log('currentUserId', currentUserId)
    if (!currentUserId) return;
    if ((await this.userCrud.findUserByID(currentUserId)) == null)
      throw new WsException("User not existing");
    const inbox_id = "inbox-".concat(currentUserId);
    client.join(inbox_id);
    (await this.chatCrud.retrieveUserDmChannels(currentUserId)).forEach(
      (room) => {
        client.join("dm-" + room.id);
      }
    ); 
  }

  @UseGuards (userRoomSubscriptionGuard) 
  @UseGuards(bannedConversationGuard)
  @SubscribeMessage("joinDm")
  async handleJoinDm(client : ClientSocket, dm_id:string) 
  {
    console.log ('Join request')
    client.join("dm-" + dm_id);
  }
  

  @SubscribeMessage("broadacastJoinSignal")
  async handleJoinSignal(client : ClientSocket, joinSignal : {dm_id:string, userToContact:string}) 
  {
    console.log("broadacastJoinSignal is called!")
    const currentUserId = client.userId;
    //if true throw server error
    
    const userToContactPublicData =  await this.userCrud.findUserSessionDataByID(joinSignal.userToContact);
    const currentUserPublicData =  await this.userCrud.findUserSessionDataByID(currentUserId);
    

    this.server.to(`inbox-${currentUserId}`).emit('updateUserContact', {id:userToContactPublicData.id,
      username: userToContactPublicData.username, 
      avatar: userToContactPublicData.avatar, 
    })
    this.server.to(`inbox-${joinSignal.userToContact}`).emit('updateUserContact', {id:currentUserPublicData.id,
      username: currentUserPublicData.username, 
      avatar: currentUserPublicData.avatar, 
    })

    this.server.to(`inbox-${currentUserId}`).emit("dmIsJoined", joinSignal.dm_id);
    this.server.to(`inbox-${joinSignal.userToContact}`).emit("dmIsJoined", joinSignal.dm_id);
  }

  @UseGuards (userRoomSubscriptionGuard) 
  @UseGuards(bannedConversationGuard)
  @SubscribeMessage("sendMsg")
  async handleSendMesDm(client : ClientSocket, message: MessageDto) {
    console.log ('sendMsg: ', message)
    message.channel_id = null;
    const messageToBrodcast = await this.chatCrud.createMessage(message);
    this.server.to(`dm-${message.dm_id}`).emit("newMessage", messageToBrodcast);
  }

  @UseGuards (userRoomSubscriptionGuard)
  @SubscribeMessage("MarkMsgRead")
  async handleMarkMsgAsRead(client : ClientSocket, room: { _id: string }) {
    const currentUserId = client.userId;

    await this.chatCrud.markRoomMessagesAsRead(currentUserId, room._id); //mark the messages that unsent by this user as read
    this.server.to(`inbox-${currentUserId}`).emit("setRoomAsRead", room);
  } 

  
  @UseGuards(userRoomSubscriptionGuard)
  @SubscribeMessage("dmModeration")
  async handleDmBan(
    client : ClientSocket,
    banSignal: { targetedUserId: string; type: string }
  ) {
    const currentUserId = client.userId;

    const dm = await this.chatCrud.findDmByUsers(
      currentUserId,
      banSignal.targetedUserId
    );
    console.log("banSignal.type == BAN && await this.chatCrud.dmIsBanned(dm.id)", banSignal.type == "BAN" && await this.chatCrud.dmIsBanned(dm.id))
    if (banSignal.type == "BAN" && await this.chatCrud.dmIsBanned(dm.id))
      return;
    if (banSignal.type == "BAN") {
      await this.chatCrud.blockAUserWithDm(banSignal.targetedUserId, dm.id);
      this.server
        .to(`dm-${dm.id}`)
        .emit("userBanned", { room_id: dm.id, agent_id: currentUserId, expirationDate: new Date("9999-12-31T23:59:59.999Z") });
    } else {
      await this.chatCrud.unblockAUserWithDm(banSignal.targetedUserId, dm.id);
      this.server
        .to(`dm-${dm.id}`)
        .emit("userUnBanned", { room_id: dm.id, agent_id: currentUserId });
    }
  }

}
