import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";

import { DmService } from "./dm.service";
import { MessageDto, banManageSignalDto } from "../../dto/chat.dto";
import { inboxPacketDto } from "../../dto/userInbox.dto";
import { Server, Socket } from "socket.io";
import {
  bannedConversationGuard,
  userRoomSubscriptionGuard,
} from "src/chat/guards/chat.guards";
import { UseGuards } from "@nestjs/common";
import { UserCrudService } from "src/prisma/user-crud.service";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import * as cookie from "cookie";

@WebSocketGateway({ namespace: "chat", cors: "*" })
export class dmGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly dmService: DmService,
    private readonly userCrud: UserCrudService,
    private readonly chatCrud: ChatCrudService
  ) {}

  //When the user connects to websocket it will be passed the id of the user
  //to use it to create an inbox of notifications and new dm's to be initiated

  async handleConnection(client: Socket, ...args: any[]) {
    const userIdCookie = this.extractUserIdFromCookies(client);
    if (!userIdCookie) return;
    if ((await this.userCrud.findUserByID(userIdCookie)) == null)
      throw new WsException("User not existing");
    console.log(`user ${userIdCookie} connected\n`);
    const inbox_id = "inbox-".concat(userIdCookie);
    client.join(inbox_id);
    (await this.chatCrud.retrieveUserDmChannels(userIdCookie)).forEach(
      (room) => {
        client.join("dm-" + room.id);
      }
    ); 
  }

  handleDisconnect(client: Socket) {
    //   // This method is triggered when a user disconnects from the WebSocket server
    //   console.log(`User disconnected: ID=${client.id}`);
  }
  private extractUserIdFromCookies(client:Socket) {
    const headers = client.handshake.headers;
    const parsedCookies = cookie.parse(headers.cookie || "");
    return parsedCookies["user.id"];
  }
  
  // @SubscribeMessage('joinInbox')
  // handleJoinInbox(client: Socket, inbox_id: string): void {
  //   console.log (`${client.id} is connected to ${inbox_id}`)
  //   client.join(inbox_id);
  // }

  // //this method serves as a postman to inbox destination
  // @SubscribeMessage('toInbox')
  // deliver_to_inbox (client: Socket, packet: inboxPacketDto)
  // {
  //   //here I will send you the room  you must join
  //   this.server.to(packet.inbox_id).emit('inboxMsg', "hello")
  //   this.server.to("inbox-" + packet.sender_id).emit('inboxMsg', "hello")
  //   //when the inboxMsg is triggered it will fire an event to client side
  //     // the right client will receive that event and will trigger the joinDm
  //     //function wich will make him join the common room , the Dm room where
  //     //the real messaging will happen
  // }

  // //this method will be triggered right after deliver_to_inbox right after the client get the dm room id
  // @SubscribeMessage ("joinDm")
  // handleJoinDm(client: Socket,  dm_id:string ) {
  //   client.join(dm_id)
  // }

  //In case
  // @UseGuards (userRoomSubscriptionGuard)
  @UseGuards(bannedConversationGuard)
  @SubscribeMessage("sendMsg")
  async handleSendMesDm(client: Socket, message: MessageDto) {
    message.channel_id = null;
    const messageToBrodcast = await this.chatCrud.createMessage(message);
    this.server.to(`dm-${message.dm_id}`).emit("newMessage", messageToBrodcast);
  }

  @SubscribeMessage("MarkMsgRead")
  async handleMarkMsgAsRead(client: Socket, room: { _id: string }) {
    const userIdCookie = this.extractUserIdFromCookies(client);
    console.log("Mark as read signal came, ", userIdCookie, ",", room._id);

    await this.chatCrud.markRoomMessagesAsRead(userIdCookie, room._id); //mark the messages that unsent by this user as read
    this.server.to(`inbox-${userIdCookie}`).emit("setRoomAsRead", room);
  }

  // @UseGuards(userRoomSubscriptionGuard)
  @SubscribeMessage("dmModeration")
  async handleDmBan(
    client: Socket,
    banSignal: { targetedUserId: string; type: string }
  ) {
    const userIdCookie = this.extractUserIdFromCookies(client);

    const dm = await this.chatCrud.findDmByUsers(
      userIdCookie,
      banSignal.targetedUserId
    );

    if (banSignal.type == "BAN") {
      await this.chatCrud.blockAUserWithDm(banSignal.targetedUserId, dm.id);
      this.server
        .to(`dm-${dm.id}`)
        .emit("userBanned", { room_id: dm.id, agent_id: userIdCookie, expirationDate: new Date("9999-12-31T23:59:59.999Z") });
    } else {
      await this.chatCrud.unblockAUserWithDm(banSignal.targetedUserId, dm.id);
      this.server
        .to(`dm-${dm.id}`)
        .emit("userUnBanned", { room_id: dm.id, agent_id: userIdCookie });
    }
  }
}
