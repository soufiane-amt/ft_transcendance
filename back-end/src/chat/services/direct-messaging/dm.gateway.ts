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


@WebSocketGateway({ namespace: "chat", cors: "*" })
export class dmGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  async handleConnection(client: any, ...args: any[]) {
    const userIdCookie = client.userId;
    if (!userIdCookie) return;
    if ((await this.userCrud.findUserByID(userIdCookie)) == null)
      throw new WsException("User not existing");
    const inbox_id = "inbox-".concat(userIdCookie);
    client.join(inbox_id);
    (await this.chatCrud.retrieveUserDmChannels(userIdCookie)).forEach(
      (room) => {
        client.join("dm-" + room.id);
      }
    ); 
  }

  handleDisconnect(client: any) {
  }
  private extractUserIdFromCookies(client:Socket) {
    const headers = client.handshake.headers;
    const parsedCookies = cookie.parse(headers.cookie || "");
    return parsedCookies["user.id"];
  }


  @UseGuards (userRoomSubscriptionGuard) 
  @UseGuards(bannedConversationGuard)
  @SubscribeMessage("joinDm")
  async handleJoinDm(client: any, dm_id:string) 
  {
    console.log ('Join request')
    client.join("dm-" + dm_id);
  }
  
  @SubscribeMessage("broadacastJoinSignal")
  async handleJoinSignal(client: any, joinSignal : {dm_id:string, userToContact:string}) 
  {
    console.log("broadacastJoinSignal is called!")
    const userIdCookie = client.userId;
    const userToContactPublicData =  await this.userCrud.findUserSessionDataByID(joinSignal.userToContact);
    const currentUserPublicData =  await this.userCrud.findUserSessionDataByID(userIdCookie);

    this.server.to(`inbox-${userIdCookie}`).emit('updateUserContact', {id:userToContactPublicData.id,
      username: userToContactPublicData.username, 
      avatar: userToContactPublicData.avatar, 
    })
    this.server.to(`inbox-${joinSignal.userToContact}`).emit('updateUserContact', {id:currentUserPublicData.id,
      username: currentUserPublicData.username, 
      avatar: currentUserPublicData.avatar, 
    })

    this.server.to(`inbox-${userIdCookie}`).emit("dmIsJoined", joinSignal.dm_id);
    this.server.to(`inbox-${joinSignal.userToContact}`).emit("dmIsJoined", joinSignal.dm_id);
  }

  @UseGuards (userRoomSubscriptionGuard) 
  @UseGuards(bannedConversationGuard)
  @SubscribeMessage("sendMsg")
  async handleSendMesDm(client: any, message: MessageDto) {
    console.log ('sendMsg: ', message)
    message.channel_id = null;
    const messageToBrodcast = await this.chatCrud.createMessage(message);
    this.server.to(`dm-${message.dm_id}`).emit("newMessage", messageToBrodcast);
  }

  @UseGuards (userRoomSubscriptionGuard)
  @SubscribeMessage("MarkMsgRead")
  async handleMarkMsgAsRead(client: any, room: { _id: string }) {
    const userIdCookie = client.userId;

    await this.chatCrud.markRoomMessagesAsRead(userIdCookie, room._id); //mark the messages that unsent by this user as read
    this.server.to(`inbox-${userIdCookie}`).emit("setRoomAsRead", room);
  } 

  
  @UseGuards(userRoomSubscriptionGuard)
  @SubscribeMessage("dmModeration")
  async handleDmBan(
    client: any,
    banSignal: { targetedUserId: string; type: string }
  ) {
    const userIdCookie = client.userId;

    const dm = await this.chatCrud.findDmByUsers(
      userIdCookie,
      banSignal.targetedUserId
    );
    console.log("banSignal.type == BAN && await this.chatCrud.dmIsBanned(dm.id)", banSignal.type == "BAN" && await this.chatCrud.dmIsBanned(dm.id))
    if (banSignal.type == "BAN" && await this.chatCrud.dmIsBanned(dm.id))
      return;
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
