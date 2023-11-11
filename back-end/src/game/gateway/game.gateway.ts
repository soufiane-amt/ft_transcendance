import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WsResponse,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import socketIOMiddleware, { wsmiddleware } from '../gateways.middleware';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GatewaysGuard } from '../guards/gateways.guard';
import { GameService } from '../game.service';
import ClientSocket from '../interfaces/clientSocket.interface';
import MatchMakingDto, { matchMakingDto } from '../dto/MatchMaking.dto';
import LeaveQueueDto, { leaveQueueDto } from '../dto/LeaveQueue.dto';
import { Status } from '@prisma/client';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import JoinGameDto, { joinGameDto } from '../dto/JoinGame.dto';
import RequestInvitationGame, {
  requestInvitationGameDto,
} from '../dto/RequestInvitationGame.dto';
import { userRoomSubscriptionGuard } from 'src/chat/guards/chat.guards';

@UseGuards(GatewaysGuard)
@WebSocketGateway({
  namespace: 'Game',
  origin: process.env.FRONT_SERV,
})
export class GameGateway implements OnGatewayInit<Server> {
  constructor(
    private readonly gameservice: GameService,
    private readonly userCrudService: UserCrudService,
  ) {}
  @WebSocketServer() private server: Server;

  async afterInit(server: Server) {
    const wsmidware: wsmiddleware = await socketIOMiddleware(this.gameservice);
    server.use(wsmidware);
  }

  handleDisconnect(client: ClientSocket) {
    const joinedQueue = this.gameservice.playerExist(client.player);
    if (joinedQueue !== undefined) {
      this.gameservice.removePlayerFromTheQueue(joinedQueue, client.player);
    }
  }

  @SubscribeMessage('matchMaking')
  async matchmakingListener(
    @MessageBody(new ZodValidationPipe(matchMakingDto))
    game_settings: MatchMakingDto,
    @ConnectedSocket() client: ClientSocket,
  ): Promise<string> {
    const user_state: Status = await this.userCrudService.getUserStatus(
      client.userId,
    );
    if (user_state === null) return 'invalid user';
    if (user_state === Status.IN_GAME) {
      return 'You are already in the game';
    }
    if (this.gameservice.playerExist(client.player) !== undefined) {
      return "can't join the queue";
    }
    const response = await this.gameservice.joinMatchMackingSystem(
      client.player,
      game_settings,
    );
    return response;
  }

  @SubscribeMessage('leave MatchMakingSystem')
  handleLeaveMatchMackingSystem(
    @MessageBody(new ZodValidationPipe(leaveQueueDto))
    leaveQueueDto: LeaveQueueDto,
    @ConnectedSocket() client: ClientSocket,
  ) {
    const { role }: LeaveQueueDto = leaveQueueDto;
    if (this.gameservice.playerExist(client.player) === undefined) {
      return 'player does not exist';
    }
    this.gameservice.removePlayerFromTheQueue(role, client.player);
    return 'the player was removed from the queue';
  }

  @SubscribeMessage('join_a_game')
  handlejoingame(
    @MessageBody(new ZodValidationPipe(joinGameDto)) joinGameDto: JoinGameDto,
    @ConnectedSocket() client: ClientSocket,
  ) {
    this.gameservice.joinGame(joinGameDto, client, this.server);
  }

  @SubscribeMessage('requestInvitationGame')
  handlerequest_for_invitation_game(
    @MessageBody(new ZodValidationPipe(requestInvitationGameDto))
    requestInvitationGameDto: RequestInvitationGame,
    @ConnectedSocket() client: ClientSocket,
  ) {
    this.gameservice.handleInvitationGame(requestInvitationGameDto, client);
  }

  @SubscribeMessage('get_user_id')
  handleget_user_id(@ConnectedSocket() client: ClientSocket): string {
    return client.userId;
  }
}
