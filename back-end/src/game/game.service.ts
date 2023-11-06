import { Injectable } from '@nestjs/common';
import { UserCrudService } from 'src/prisma/user-crud.service';
import MatchMakingDto from './dto/MatchMaking.dto';
import ClientSocket from './interfaces/clientSocket.interface';
import GuestPlayer from './interfaces/guestPlayer.interface';
import HostPlayer from './interfaces/hostPlayers.interface';
import { Player } from './interfaces/player.interface';
import GameSettings from './interfaces/GameSettings.interface';
import { GameCrudService } from 'src/prisma/game-crud.service';
import CreateGame from 'src/prisma/interfaces/CreateGame.interface';
import GameInvitationDto from './dto/GameInvitation.dto';
import { Server, Socket } from 'socket.io';
import { gameInvitationResponseDto } from './dto/GameInvitationResponse.dto';
import GameInvitationResponseDto from './dto/GameInvitationResponse.dto';
import JoinGameDto from './dto/JoinGame.dto';
import { GameGateway } from './gateway/game.gateway';
import Game from './Game/classes/Game';
import GameScore from 'src/prisma/interfaces/GameScore.interface';
import GameInfo from './interfaces/GameInfo';
import RequestInvitationGameDto from './dto/RequestInvitationGame.dto';
import { User } from '@prisma/client';

@Injectable()
export class GameService {
  private hostPlayers: HostPlayer[] = [];
  private guestPlayers: GuestPlayer[] = [];
  private pandingGames: Map<string, ClientSocket> = new Map();
  private invitationGamesInfo: Map<string, GameInfo> = new Map();
  private invitationGames: Map<string, string[]> = new Map();

  constructor(
    private readonly userCrudService: UserCrudService,
    private readonly gameCrudService: GameCrudService,
  ) {}

  async joinMatchMackingSystem(
    player: Player,
    matchMakingDto: MatchMakingDto,
  ): Promise<string> {
    if (matchMakingDto.role.toLowerCase() === 'host') {
      const game_settings: GameSettings = {
        mapType: matchMakingDto.mapType,
        speed: matchMakingDto.speed,
      };
      const hostPlayer = {
        player,
        game_settings,
      };
      const response: string = await this.HostLookForOpponent(hostPlayer);
      return response;
    } else if (matchMakingDto.role.toLowerCase() === 'guest') {
      const guestPlayer: GuestPlayer = { player };
      const response: string = await this.GuestLookForOpponent(guestPlayer);
      return response;
    }
  }
  async get_player(client: ClientSocket): Promise<Player | null> {
    const user: User = await this.userCrudService.findUserByID(client.userId);
    if (user === null) return null;
    const level = await this.gameCrudService.retrieveUserLevel(client.userId);
    if (level === null) return null;
    return {
      id: client.userId,
      username: user.username,
      level,
      socket: client,
    };
  }

  async HostLookForOpponent(hostPlayer: HostPlayer): Promise<string> {
    if (this.guestPlayers.length !== 0) {
      const opponent = this.findClosestlevel(
        this.guestPlayers,
        hostPlayer.player,
      );
      const players: CreateGame = {
        player1_id: hostPlayer.player.id,
        player2_id: opponent.player.id,
      };
      const game_id: string = (await this.gameCrudService.createGame(players))
        .game_id;
      this.removePlayerFromTheQueue('host', hostPlayer.player);
      this.removePlayerFromTheQueue('guest', opponent.player);
      const gameInfo: GameInfo = {
        player1_id: hostPlayer.player.id,
        game_id,
        player1_username: hostPlayer.player.username,
        player2_id: opponent.player.id,
        player2_username: opponent.player.username,
        mapType: hostPlayer.game_settings.mapType,
        speed: hostPlayer.game_settings.speed,
      };
      const hostPlayerSide: string = 'left';
      const opponentPlayerSide: string = 'right';
      hostPlayer.player.socket.emit(
        'redirect_to_game',
        gameInfo,
        hostPlayerSide,
      );
      opponent.player.socket.emit(
        'redirect_to_game',
        gameInfo,
        opponentPlayerSide,
      );
      return 'game is found!';
    } else if (this.hostPlayers.length !== 0) {
      const matchingSettings: HostPlayer[] = this.hostPlayers.filter(
        (pl: HostPlayer) =>
          pl.game_settings.speed === hostPlayer.game_settings.speed &&
          pl.game_settings.mapType === hostPlayer.game_settings.mapType,
      );
      if (matchingSettings.length !== 0) {
        const opponent = this.findClosestlevel(
          matchingSettings,
          hostPlayer.player,
        );
        const players: CreateGame = {
          player1_id: hostPlayer.player.id,
          player2_id: opponent.player.id,
        };
        const game_id: string = (await this.gameCrudService.createGame(players))
          .game_id;
        const gameInfo: GameInfo = {
          game_id,
          player1_id: hostPlayer.player.id,
          player1_username: hostPlayer.player.username,
          player2_id: opponent.player.id,
          player2_username: opponent.player.username,
          mapType: hostPlayer.game_settings.mapType,
          speed: hostPlayer.game_settings.speed,
        };
        const hostPlayerSide: string = 'left';
        const opponentPlayerSide: string = 'right';
        hostPlayer.player.socket.emit(
          'redirect_to_game',
          gameInfo,
          hostPlayerSide,
        );
        opponent.player.socket.emit(
          'redirect_to_game',
          gameInfo,
          opponentPlayerSide,
        );
        this.removePlayerFromTheQueue('host', hostPlayer.player);
        this.removePlayerFromTheQueue('host', opponent.player);
        return 'game is found!';
      }
    }
    this.hostPlayers.push(hostPlayer);
    this.hostPlayers.sort((pl1, pl2) => pl1.player.level - pl2.player.level);
    return 'the player join the queue';
  }

  async GuestLookForOpponent(guestPlayer: GuestPlayer): Promise<string> {
    if (this.hostPlayers.length !== 0) {
      const opponent = this.findClosestlevel(
        this.hostPlayers,
        guestPlayer.player,
      );
      const players: CreateGame = {
        player1_id: guestPlayer.player.id,
        player2_id: opponent.player.id,
      };
      const game_id: string = (await this.gameCrudService.createGame(players))
        .game_id;
      const gameInfo: GameInfo = {
        game_id,
        player1_id: guestPlayer.player.id,
        player1_username: guestPlayer.player.username,
        player2_id: opponent.player.id,
        player2_username: opponent.player.username,
        mapType: opponent.game_settings.mapType,
        speed: opponent.game_settings.speed,
      };
      const guestPlayerSide: string = 'left';
      const opponentPlayerSide: string = 'right';
      guestPlayer.player.socket.emit(
        'redirect_to_game',
        gameInfo,
        guestPlayerSide,
      );
      opponent.player.socket.emit(
        'redirect_to_game',
        gameInfo,
        opponentPlayerSide,
      );
      this.removePlayerFromTheQueue('guest', guestPlayer.player);
      this.removePlayerFromTheQueue('host', opponent.player);
      return 'the game is found';
    }
    this.guestPlayers.push(guestPlayer);
    this.guestPlayers.sort((pl1, pl2) => pl1.player.level - pl2.player.level);
    return 'the player join the queue';
  }

  findClosestlevel(queue: HostPlayer[] | GuestPlayer[], player: Player) {
    let left = 0;
    let right = queue.length - 1;
    let closest = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (queue[mid].player.level === player.level) {
        return queue[mid];
      } else if (queue[mid].player.level < player.level) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
      if (
        closest === null ||
        Math.abs(queue[mid].player.level - player.level) <
          Math.abs(closest.player.level - player.level)
      ) {
        closest = queue[mid];
      }
    }

    return closest;
  }

  removePlayerFromTheQueue(role: string, player: Player): void {
    if (role.toLowerCase() === 'host') {
      this.hostPlayers = this.hostPlayers.filter(
        (pl) => pl.player.id !== player.id,
      );
    } else if (role.toLowerCase() === 'guest') {
      this.guestPlayers = this.guestPlayers.filter(
        (pl) => pl.player.id !== player.id,
      );
    }
  }

  playerExist(player: Player): string | undefined {
    if (this.hostPlayers.some((pl) => pl.player.id === player.id) === true)
      return 'host';
    else if (
      this.guestPlayers.some((pl) => pl.player.id === player.id) === true
    )
      return 'guest';
    return undefined;
  }

  sendInvitation(
    gameInvitationDto: GameInvitationDto,
    server: Server,
    invitorSocket: Socket,
  ): void {
    const inviteeRoom: string = `gameInv-${gameInvitationDto.invitee_id}`;
    const invitationRoom: string = `inv-${gameInvitationDto.invitor_id}`;
    invitorSocket.join(invitationRoom);
    server.to(inviteeRoom).emit('GameInvitation', gameInvitationDto);
  }

  async sendGameInvitationResponse(gameInvitationResponseDto: GameInvitationResponseDto, server: Server, inviteeSocket: Socket): Promise<string> {
    const invitationRoom: string = `inv-${gameInvitationResponseDto.invitor_id}`;
    if (!server.of('/').adapter.rooms.has(invitationRoom)) {
      const payload: string = 'the invitor is offline';
      inviteeSocket.emit('GameInvitationResponse', payload);
      return 'the invitor is offline';
    }
    if (gameInvitationResponseDto.response === 'accepted') {
      const players: CreateGame = {
        player1_id: gameInvitationResponseDto.invitor_id,
        player2_id: gameInvitationResponseDto.invitee_id,
      };
      const game_id = (await this.gameCrudService.createGame(players)).game_id;
      const invitor : User | null = (await this.userCrudService.findUserByID(gameInvitationResponseDto.invitor_id))
      if (invitor === null) return 'unauthorized user';
      const invitorUsername: string = invitor.username;
      const invitee: User | null = (await this.userCrudService.findUserByID(gameInvitationResponseDto.invitee_id));
      if (invitee === null) return 'unauthorized user';
      const inviteeUsername: string = invitee.username;
      const gameInfo : GameInfo = {
        game_id,
        player1_id: gameInvitationResponseDto.invitor_id,
        player1_username: invitorUsername,
        player2_id: gameInvitationResponseDto.invitee_id,
        player2_username: inviteeUsername,
        mapType: gameInvitationResponseDto.mapType,
        speed: gameInvitationResponseDto.speed,
      };
      this.invitationGamesInfo.set(game_id, gameInfo);
      const payload: string = game_id;
      server.to(invitationRoom).emit('redirect_to_invitation_game', payload);
      inviteeSocket.emit('redirect_to_invitation_game', payload);
      const inviteeRoom: string = `gameInv-${gameInvitationResponseDto.invitee_id}`;
      server.to(inviteeRoom).emit('close_game_invitation_model');
    } else if (gameInvitationResponseDto.response === 'declined') {
      const payload: string = 'invitation declined';
      server.to(invitationRoom).emit('GameInvitationResponse', payload);
      const inviteeRoom: string = `gameInv-${gameInvitationResponseDto.invitee_id}`;
      server.to(inviteeRoom).emit('close_game_invitation_model');
    }
    server.of('/').adapter.rooms.delete(invitationRoom);
  }

  async joinGame(joinGame: JoinGameDto, client: ClientSocket, server: Server) : Promise<void> {
    const game = this.pandingGames.get(joinGame.game_id);
    if (game === undefined) {
      this.pandingGames.set(joinGame.game_id, client);
    } else {
      const firstPlayer: ClientSocket = this.pandingGames.get(joinGame.game_id);
      const gameRoom: string = `${joinGame.player1_id}-${joinGame.player2_id}`;
      client.join(gameRoom);
      firstPlayer.join(gameRoom);
      this.pandingGames.delete(joinGame.game_id);
      await this.startGame(client, firstPlayer, gameRoom, joinGame, server);
    }
  }

  async startGame(
    player1Socket: ClientSocket,
    player2Socket: ClientSocket,
    gameRoom: string,
    joinGame: JoinGameDto,
    server: Server,
  ): Promise<void> {
    const leftPlayerSocket: Socket =
      player1Socket.player.id === joinGame.player1_id
        ? player1Socket.player.socket
        : player2Socket.player.socket;
    const rightPlayerSocket: Socket =
      player1Socket.player.id === joinGame.player2_id
        ? player1Socket.player.socket
        : player2Socket.player.socket;
    const speed: string = joinGame.speed.toLowerCase();
    const gameId: string = joinGame.game_id;
    const mapType: string = joinGame.mapType.toLowerCase();
    const game: Game = new Game(
      gameId,
      leftPlayerSocket,
      rightPlayerSocket,
      speed,
      server,
      gameRoom,
      mapType,
    );
    await this.gameCrudService.updateGameStatus(gameId, 'IN_PROGRESS');
    const intervalId: NodeJS.Timeout = setInterval(() => {
      if (game.status === 'started') {
        game.play();
      }
      if (game.status === 'finished') {
        const gameScore: GameScore = {
          player1_score: game.leftPlayer.winningRounds,
          player2_score: game.rightPlayer.winningRounds,
        };
        this.updateDataBase(
          gameId,
          gameScore,
          player1Socket.player.id,
          player2Socket.player.id,
        );
        clearInterval(intervalId);
      }
    }, 60);
  }

  async updateDataBase(
    game_id: string,
    gameScore: GameScore,
    player1_id: string,
    player2_id: string,
  ): Promise<void> {
    await this.gameCrudService.updateGameStatus(game_id, 'FINISHED');
    await this.gameCrudService.updateGameScore(game_id, gameScore);
    const loser: string =
      gameScore.player1_score > gameScore.player2_score
        ? player2_id
        : player1_id;
    const winner: string =
      gameScore.player1_score > gameScore.player2_score
        ? player1_id
        : player2_id;
    await this.gameCrudService.addLossesToUser(loser);
    await this.gameCrudService.addWinsToUser(winner);
    await this.userCrudService.changeVisibily(player1_id, 'ONLINE');
    await this.userCrudService.changeVisibily(player2_id, 'ONLINE');
  }

  handleInvitationGame(requestInvitationGameDto : RequestInvitationGameDto, client: ClientSocket) : void{
    const gameInfo: GameInfo = this.invitationGamesInfo.get(requestInvitationGameDto.game_id);
    if (gameInfo !== undefined) {
      const side: string =
        client.player.id === gameInfo.player1_id ? 'left' : 'right';
      const players: string[] = this.invitationGames.get(
        requestInvitationGameDto.game_id,
      );
      if (players === undefined) {
        this.invitationGames.set(
          requestInvitationGameDto.game_id,
          Array<string>(client.player.id),
        );
        client.emit('redirect_to_game', gameInfo, side);
      } else if (players.includes(client.player.id) !== true) {
        client.emit('redirect_to_game', gameInfo, side);
        this.invitationGames.delete(requestInvitationGameDto.game_id);
        this.invitationGamesInfo.delete(requestInvitationGameDto.game_id);
      }
    }
  }
}
