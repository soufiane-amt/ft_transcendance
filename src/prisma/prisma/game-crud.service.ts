import { Inject, Injectable } from '@nestjs/common';
import {  PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { matchDto } from '../../chat/dto/match.dto'
import { catchError } from '../decorators.prisma';

@Injectable()
export class GameCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}

    @catchError()
    async createGame (data: matchDto)
    {
        return this.prisma.prismaClient.match.create ({data})
    }


    @catchError()
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