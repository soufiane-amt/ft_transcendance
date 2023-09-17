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

}