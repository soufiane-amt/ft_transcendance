import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { matchDto } from 'src/chat/dto/match.dto';


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