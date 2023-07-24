import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService 
{
    private readonly prisma: PrismaClient;

    constructor ()
    {
        this.prisma = new PrismaClient
    }
}
/*By using DI, you don't need to create separate instances of the Prisma client in each service class.
 NestJS will handle the creation and sharing of the PrismaService instance across all services that inject it. 
 This promotes code reusability and ensures that all services use the same Prisma client,
improving performance and maintaining a consistent state.


 */