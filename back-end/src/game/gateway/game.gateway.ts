import { OnGatewayInit, SubscribeMessage, WebSocketGateway,OnGatewayConnection, WsResponse, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import socketIOMiddleware from '../gateways.middleware';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GatewaysGuard } from '../guards/gateways.guard';
import { GameService } from '../game.service';
import ClientSocket from '../interfaces/clientSocket.interface';
import MatchMakingDto from '../dto/MatchMaking.dto';

@UseGuards(GatewaysGuard)
@WebSocketGateway({
                    namespace : 'Game',
                    origin : process.env.FRONT_SERV
                  })
export class GameGateway implements OnGatewayInit<Server>, OnGatewayConnection<ClientSocket> {
  constructor(private readonly gameservice: GameService) {}

  afterInit(server: Server) {
    server.use(socketIOMiddleware);
  }

  async handleConnection(client: ClientSocket, ...args: any[]) {
    client.player = await this.gameservice.get_player(client);
  }

  @SubscribeMessage('matchMaking')
  async matchmakingListener(@MessageBody() payload: string,@ConnectedSocket() client: ClientSocket): Promise<string> {
    const game_settings : MatchMakingDto = JSON.parse(payload);
    const response = await this.gameservice.joinMatchMackingSystem(client.player, game_settings);
    return response;
  }
}
