import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { matchDto } from 'src/chat/dto/match.dto';
<<<<<<< HEAD


@Injectable()
export class GameCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}

    async createGame (data: matchDto)
    {
        return this.prisma.prismaClient.match.create ({data})
    }


    async retieveAllGamerecords (user_id : string)
    {
        return this.prisma.prismaClient.match.findMany ({
            where:
            {
                OR :[
                    {player_1_id : user_id},
                    {player_2_id : user_id}
                ]
            }
        })
    }

    async retreiveGamesScoreForStatistic (user_id : string)
    {
        const swapScore = function swapScores(scoreString) {
            const scores = scoreString.split('-');
            if (scores.length === 2)
              return scores.reverse().join('-');
            else
              return 'Invalid score format';
          }
        const userGamesRecord = this.retieveAllGamerecords (user_id)

        const statisticalRecord = (await userGamesRecord).map((match)=>{
            var opponent_id : string ;
            if (user_id === match.player_1_id){
                opponent_id = match.player_2_id
            }
            else{
                opponent_id = match.player_1_id
                match.result = swapScore(match.result)
            }
            return { match_id: match.id, opponent_id: opponent_id, result:match.result, createdAt:match.createdAt}
        })
        return (statisticalRecord)
    }

}
=======
import { Game, GameStatus, Stats, User } from '@prisma/client';
import GameStatistics from './interfaces/GameStatistics.interface';
import CreateGame from './interfaces/CreateGame.interface';
import GameScore from './interfaces/GameScore.interface';
import { UserCrudService } from './user-crud.service';

@Injectable()
export class GameCrudService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly userCrudService: UserCrudService,
  ) {}

  async createGame(data: CreateGame): Promise<Game> {
    return this.prisma.prismaClient.game.create({ data });
  }

  async addLossesToUser(user_id: string): Promise<Stats | null> {
    try {
      return await this.prisma.prismaClient.stats.update({
        where: {
          user_id,
        },
        data: {
          losses: {
            increment: 1,
          },
        },
      });
    } catch {
      return null;
    }
  }
  async addWinsToUser(user_id: string): Promise<Stats | null> {
    try {
      const state: Stats = await this.prisma.prismaClient.stats.update({
        where: {
          user_id,
        },
        data: {
          wins: {
            increment: 1,
          },
        },
      });
      if (state.wins !== 0 && state.wins % 5 === 0) {
        await this.updateUserLevel(user_id);
        return state;
      }
    } catch {
      return null;
    }
  }

  async updateUserLevel(userId: string): Promise<Stats | null> {
    try {
      return await this.prisma.prismaClient.stats.update({
        where: {
          user_id: userId,
        },
        data: {
          ladder_level: {
            increment: 1,
          },
        },
      });
    } catch {
      return null;
    }
  }
  async updateGameStatus(
    game_id: string,
    status: GameStatus,
  ): Promise<Game | null> {
    try {
      return await this.prisma.prismaClient.game.update({
        where: {
          game_id,
        },
        data: {
          status,
        },
      });
    } catch {
      return null;
    }
  }

  async updateGameScore(
    game_id: string,
    score: GameScore,
  ): Promise<Game | null> {
    try {
      return await this.prisma.prismaClient.game.update({
        where: {
          game_id,
        },
        data: {
          player1_score: score.player1_score,
          player2_score: score.player2_score,
        },
      });
    } catch {
      return null;
    }
  }

  async retrieveUserLevel(user_id: string): Promise<number | null> {
    const user: any = await this.prisma.prismaClient.stats.findUnique({
      where: {
        user_id,
      },
      select: {
        ladder_level: true,
      },
    });
    if (user === null) return null;
    return user.ladder_level;
  }

  async retieveAllGamerecords(user_id: string): Promise<Game[] | []> {
    return await this.prisma.prismaClient.game.findMany({
      where: {
        OR: [{ player1_id: user_id }, { player2_id: user_id }],
      },
    });
  }

  async retreiveGamesScoreForStatistic(
    user_id: string,
  ): Promise<GameStatistics[] | []> {
    const games: Game[] | [] = await this.prisma.prismaClient.game.findMany({
      where: {
        OR: [{ player1_id: user_id }, { player2_id: user_id }],
      },
    });
    if (games.length === 0) return [];
    const gameStatistics: GameStatistics[] = Array<GameStatistics>();
    for (const game of games) {
      const opponent_id: string =
        game.player1_id === user_id ? game.player2_id : game.player1_id;
      const user: User | null =
        await this.userCrudService.findUserByID(user_id);
      const opponent: User | null =
        await this.userCrudService.findUserByID(opponent_id);
      const user_avatar: string = user !== null ? user.avatar : '';
      const user_username: string = user !== null ? user.username : '';
      const opponent_username: string =
        opponent !== null ? opponent.username : '';
      const opponent_avatar: string = opponent !== null ? opponent.avatar : '';
      const result =
        game.player1_id === user_id
          ? `${game.player1_score}-${game.player2_score}`
          : `${game.player2_score}-${game.player1_score}`;
      const createdAt: Date = game.created_At;
      const gameId: string = game.game_id;
      const item: GameStatistics = {
        user_username,
        user_avatar,
        opponent_username,
        opponent_avatar,
        result,
        gameId,
        createdAt,
      };
      gameStatistics.push(item);
    }
    gameStatistics.sort(
      (firstGame: GameStatistics, secondGame: GameStatistics) =>
        Number(secondGame.createdAt) - Number(firstGame.createdAt),
    );
    return gameStatistics;
  }
}
>>>>>>> origin/game_dashboard
