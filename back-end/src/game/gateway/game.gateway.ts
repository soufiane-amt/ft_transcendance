import { OnGatewayInit, SubscribeMessage, WebSocketGateway,OnGatewayConnection, WsResponse, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import socketIOMiddleware from '../gateways.middleware';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GatewaysGuard } from '../guards/gateways.guard';
import { GameService } from '../game.service';
import ClientSocket from '../interfaces/clientSocket.interface';
import MatchMakingDto from '../dto/MatchMaking.dto';
import LeaveQueueDto from '../dto/LeaveQueue.dto';
import { Status } from '@prisma/client';
import { UserCrudService } from 'src/prisma/user-crud.service';

@UseGuards(GatewaysGuard)
@WebSocketGateway({
                    namespace : 'Game',
                    origin : process.env.FRONT_SERV
                  })
export class GameGateway implements OnGatewayInit<Server>, OnGatewayConnection<ClientSocket> {
  constructor(private readonly gameservice: GameService, private readonly userCrudService: UserCrudService) {}

  afterInit(server: Server) {
    server.use(socketIOMiddleware);
  }

  async handleConnection(client: ClientSocket, ...args: any[]) {
    client.player = await this.gameservice.get_player(client);
  }

  @SubscribeMessage('matchMaking')
  async matchmakingListener(@MessageBody() payload: string,@ConnectedSocket() client: ClientSocket): Promise<string> {
    console.log(client.player);
    const game_settings : MatchMakingDto = JSON.parse(payload);
    const user_state : Status = await this.userCrudService.getUserStatus(client.userId);
    if (user_state === Status.IN_GAME) {
      return "can't join the queue";
    }
    if (this.gameservice.playerExist(client.player) == false) {
      return "can't join the queue";
    }
    const response = await this.gameservice.joinMatchMackingSystem(client.player, game_settings);
    return response;
  }

  @SubscribeMessage('leave MatchMackingSystem')
  handleLeaveMatchMackingSystem(@MessageBody() payload: string, @ConnectedSocket() client: ClientSocket) {
    const { role } : LeaveQueueDto = JSON.parse(payload);
    this.gameservice.removePlayerFromTheQueue(role, client.player);
    return 'the player was removed from the queue';
  }
}
