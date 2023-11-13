import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService 
{
    private readonly prisma: PrismaClient;
  directMessaging: any;
  channelMembership: any;

    constructor ()
    {
        this.prisma = new PrismaClient()
        console.log('Prisma client initialized.');

    }
    get prismaClient(): PrismaClient {
        return this.prisma;
      }

}
