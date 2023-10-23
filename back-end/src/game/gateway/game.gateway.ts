import { OnGatewayInit, SubscribeMessage, WebSocketGateway,OnGatewayConnection, WsResponse, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import socketIOMiddleware from '../gateways.middleware';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GatewaysGuard } from '../guards/gateways.guard';
import { GameService } from '../game.service';
import ClientSocket from '../interfaces/clientSocket.interface';
import MatchMakingDto, { matchMakingDto } from '../dto/MatchMaking.dto';
import LeaveQueueDto, { leaveQueueDto } from '../dto/LeaveQueue.dto';
import { Status } from '@prisma/client';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

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
  async matchmakingListener(@MessageBody(new ZodValidationPipe(matchMakingDto)) game_settings: MatchMakingDto,@ConnectedSocket() client: ClientSocket): Promise<string> {
    const user_state : Status = await this.userCrudService.getUserStatus(client.userId);
    if (user_state === Status.IN_GAME) {
      return "can't join the queue";
    }
    if (this.gameservice.playerExist(client.player) == true) {
      return "can't join the queue";
    }
    const response = await this.gameservice.joinMatchMackingSystem(client.player, game_settings);
    return response;
  }

  @SubscribeMessage('leave MatchMakingSystem')
  handleLeaveMatchMackingSystem(@MessageBody(new ZodValidationPipe(leaveQueueDto)) leaveQueueDto: LeaveQueueDto, @ConnectedSocket() client: ClientSocket) {
    const { role } : LeaveQueueDto = leaveQueueDto;
    if (this.gameservice.playerExist(client.player) === false) {
      return 'player does not exist';
    }
    this.gameservice.removePlayerFromTheQueue(role, client.player);
    return 'the player was removed from the queue';
  }
}
