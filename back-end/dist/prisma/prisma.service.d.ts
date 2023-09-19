import { PrismaClient } from '@prisma/client';
export declare class PrismaService {
    private readonly prisma;
    constructor();
    get prismaClient(): PrismaClient;
}
