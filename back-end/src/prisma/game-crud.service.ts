import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { matchDto } from 'src/chat/dto/match.dto';
import { Game, GameStatus, Stats } from '@prisma/client';
import GameStatistics from './interfaces/GameStatistics.interface';
import CreateGame from './interfaces/CreateGame.interface';
import GameScore from './interfaces/GameScore.interface';


@Injectable()
export class GameCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}

    async createGame (data: CreateGame) : Promise<Game>
    {
        return this.prisma.prismaClient.game.create({data});
    }

    async addLossesToUser(user_id: string) {
        await this.prisma.prismaClient.stats.update({
            where: {
                user_id
            },
            data: {
                losses: {
                    increment: 1
                }
            }
        })
    }
    async addWinsToUser(user_id: string) {
        const state: Stats = await this.prisma.prismaClient.stats.update(
            {
                where: {
                    user_id
                },
                data: {
                    wins: {
                        increment: 1
                    }
                }
            }
        )
        if (state.wins !== 0 && (state.wins % 5 === 0)){
            this.updateUserLevel(user_id);
        }
    }

    async updateUserLevel(userId: string) {
        return this.prisma.prismaClient.stats.update({
                    where: {
                        user_id: userId
                    },
                    data: {
                        ladder_level: {
                            increment: 1
                        }
                    }
        })
    }
    async updateGameStatus(game_id: string, status: GameStatus){
        return this.prisma.prismaClient.game.update({
                                where:{
                                    game_id
                                },
                                data:{
                                    status
                                }})
    }

    async updateGameScore(game_id: string, score: GameScore) {
        await this.prisma.prismaClient.game.update({
            where: {
                game_id
            },
            data: {
                player1_score: score.player1_score,
                player2_score: score.player2_score
            }
        })
    }

    async retrieveUserLevel(user_id: string) {
        const { ladder_level } = await this.prisma.prismaClient.stats.findUnique({
            where: {
                user_id
            },
            select: {
                ladder_level: true
            }
        })
        return ladder_level;
    }
    async retieveAllGamerecords (user_id : string) : Promise<Game[]>
    {
        return this.prisma.prismaClient.game.findMany ({
            where:
            {
                OR :[
                    {player1_id : user_id},
                    {player2_id : user_id}
                ]
            }
        })
    }

    async retreiveGamesScoreForStatistic(user_id : string) : Promise<GameStatistics[]>
    {
        const games: Game[] = await this.prisma.prismaClient.game.findMany({
            where: {
                OR :[
                    {player1_id : user_id},
                    {player2_id : user_id}
                ]
            }
        })
        const gameStatistics: GameStatistics[] = games.map((game) : GameStatistics => {
            const opponent_id = game.player1_id === user_id ? game.player2_id : game.player1_id;
            const result = game.player1_id === user_id ? `{game.player1_score}-{game.player2_score}` : `{game.player2_score}-{game.player1_score}`;
            return ({ match_id: game.game_id, opponent_id, result, createdAt:game.created_At })
        })
        return gameStatistics;
        }
    }
