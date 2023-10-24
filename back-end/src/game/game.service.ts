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

@Injectable()
export class GameService {
  private hostPlayers: HostPlayer[] = [];
  private guestPlayers: GuestPlayer[] = [];
  private pandingGames: Map<string, Socket> = new Map();

  constructor(private readonly userCrudService: UserCrudService, private readonly gameCrudService: GameCrudService) {}

  async joinMatchMackingSystem(player: Player, matchMakingDto: MatchMakingDto): Promise<string> {
    if (matchMakingDto.role === 'host') {
        const game_settings: GameSettings = { 
                                mapType : matchMakingDto.mapType,
                                speed: matchMakingDto.speed
                            }
        const hostPlayer = {
                            player,
                            game_settings
                        }
        const response: string = await this.HostLookForOpponent(hostPlayer);
        return response;
    } else {
        const guestPlayer: GuestPlayer = { player }; 
        const response: string = await this.GuestLookForOpponent(guestPlayer);
        return response;
    }
  }
  async get_player(client: ClientSocket): Promise<Player> {
    const { username } = await this.userCrudService.findUserByID(client.userId);
    const level = await this.gameCrudService.retrieveUserLevel(client.userId);
    return {
      id: client.userId,
      username,
      level,
      socket: client
    };
  }

  async HostLookForOpponent(hostPlayer: HostPlayer): Promise<string> {
    if (this.guestPlayers.length !== 0) {
        const opponent = this.findClosestlevel(this.guestPlayers, hostPlayer.player);
        const players : CreateGame = {player1_id: hostPlayer.player.id, player2_id: opponent.player.id};
        const game_id: string = (await this.gameCrudService.createGame(players)).game_id;
        this.removePlayerFromTheQueue('host', hostPlayer.player);
        this.removePlayerFromTheQueue('guest', opponent.player);
        const gameInfo = {
            player1_id: hostPlayer.player.id,
            game_id,
            player1_username: hostPlayer.player.username,
            player2_id : opponent.player.id,
            player2_username: opponent.player.username,
            mapType: hostPlayer.game_settings.mapType
          }
        hostPlayer.player.socket.emit('redirect_to_game', gameInfo);
        opponent.player.socket.emit('redirect_to_game', gameInfo);
        return 'game is found!';
    } else if (this.hostPlayers.length !== 0) {
        const matchingSettings: HostPlayer[] = this.hostPlayers.filter((pl: HostPlayer) => (pl.game_settings.speed === hostPlayer.game_settings.speed
                                                                                              && pl.game_settings.mapType === hostPlayer.game_settings.mapType));
        if (matchingSettings.length !== 0) {
          const opponent = this.findClosestlevel(matchingSettings, hostPlayer.player);
          const players : CreateGame = {player1_id: hostPlayer.player.id, player2_id: opponent.player.id};
          const game_id: string = (await this.gameCrudService.createGame(players)).game_id;
          const gameInfo = {
            game_id,
            player1_id: hostPlayer.player.id,
            player1_username: hostPlayer.player.username,
            player2_id : opponent.player.id,
            player2_username: opponent.player.username,
            mapType: hostPlayer.game_settings.mapType,
            speed: hostPlayer.game_settings.speed
        }
        hostPlayer.player.socket.emit('redirect_to_game', gameInfo);
        opponent.player.socket.emit('redirect_to_game', gameInfo);
        this.removePlayerFromTheQueue('host', hostPlayer.player);
        this.removePlayerFromTheQueue('guest', opponent.player);
        return 'game is found!';
        }
    }
    this.hostPlayers.push(hostPlayer);
    this.hostPlayers.sort((pl1, pl2) => pl1.player.level - pl2.player.level);
    return 'the player join the queue';
  }

  async GuestLookForOpponent(guestPlayer: GuestPlayer): Promise<string> {
    if (this.hostPlayers.length !== 0) {
        const opponent = this.findClosestlevel(this.hostPlayers, guestPlayer.player);
        const players: CreateGame = {player1_id: guestPlayer.player.id, player2_id: opponent.player.id};
        const game_id: string = (await this.gameCrudService.createGame(players)).game_id;
        const gameInfo = {
          game_id,
          player1_id: guestPlayer.player.id,
          player1_username: guestPlayer.player.username,
          player2_id : opponent.player.id,
          player2_username: opponent.player.username,
          mapType: opponent.game_settings.mapType,
          speed: opponent.game_settings.speed
      }
      guestPlayer.player.socket.emit('redirect_to_game', gameInfo);
      opponent.player.socket.emit('redirect_to_game', gameInfo);
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
          Math.abs(closest.level - player.level)
      ) {
        closest = queue[mid];
      }
    }

    return closest;
  }

  removePlayerFromTheQueue(role: string, player: Player) : void {
    if (role === 'host') {
      this.hostPlayers = this.hostPlayers.filter((pl) => pl.player.id !== player.id);
    } else {
      this.guestPlayers = this.guestPlayers.filter((pl) => pl.player.id !== player.id);
    }
  }

  playerExist(player: Player): string | undefined {
    if (this.hostPlayers.some((pl) => pl.player.id === player.id) === true)
      return 'host';
    else if (this.guestPlayers.some((pl) => pl.player.id === player.id) === true)
      return 'guest';
    return undefined;
  }

  sendInvitation(gameInvitationDto: GameInvitationDto, server: Server, invitorSocket: Socket): void {
    const inviteeRoom: string = `gameInv-${gameInvitationDto.invitee_id}`;
    const invitationRoom: string = `inv-${gameInvitationDto.invitor_id}`;
    invitorSocket.join(invitationRoom);
    server.to(inviteeRoom).emit('GameInvitation', gameInvitationDto);
  }

  async sendGameInvitationResponse(gameInvitationResponseDto: GameInvitationResponseDto, server: Server, inviteeSocket: Socket): Promise<void> {
    const invitationRoom: string = `inv-${gameInvitationResponseDto.invitor_id}`;
    if (!server.of('/').adapter.rooms.has(invitationRoom)) {
      const payload: string = 'the invitor is offline';
      inviteeSocket.emit('GameInvitationResponse', payload);
      return ;
    }
    if (gameInvitationResponseDto.response === 'accepted') {
      const players: CreateGame = {player1_id:  gameInvitationResponseDto.invitor_id, player2_id: gameInvitationResponseDto.invitee_id};
      const game_id = (await this.gameCrudService.createGame(players)).game_id;
      const invitorUsername: string = (await this.userCrudService.findUserByID(gameInvitationResponseDto.invitor_id)).username;
      const inviteeUsername: string = (await this.userCrudService.findUserByID(gameInvitationResponseDto.invitee_id)).username;
      const gameInfo = {
        game_id,
        player1_id: gameInvitationResponseDto.invitor_id,
        player1_username: invitorUsername,
        player2_id : gameInvitationResponseDto.invitee_id,
        player2_username: inviteeUsername,
        mapType: gameInvitationResponseDto.mapType,
        speed: gameInvitationResponseDto.speed
      }
      inviteeSocket.join(invitationRoom);
      server.to(invitationRoom).emit('redirect_to_game', gameInfo);
    } else if (gameInvitationResponseDto.response === 'decline') {
      const payload: string = 'invitation declined';
      server.to(invitationRoom).emit('GameInvitationResponse', payload);
    }
    server.of('/').adapter.rooms.delete(invitationRoom);
  }

  joinGame(joinGame: JoinGameDto, client: Socket, server: Server) {
    const game = this.pandingGames.get(joinGame.game_id);
    if (game === undefined) {
      this.pandingGames.set(joinGame.game_id, client);
    } else {
      const firstPlayer: Socket = this.pandingGames.get(joinGame.game_id);
      const gameRoom: string = `${joinGame.player1_id}-${joinGame.player2_id}`;
      client.join(gameRoom);
      firstPlayer.join(gameRoom);
      this.pandingGames.delete(joinGame.game_id);
    }
  } 
}