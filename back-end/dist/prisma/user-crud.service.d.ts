import { PrismaService } from './prisma.service';
export declare class UserCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findUserByID(userId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
        avatar: string;
        background: string;
        firstauth: boolean;
        status: import(".prisma/client").Status;
    }, unknown> & {}>;
    findUserByUsername(username: string): Promise<string>;
    findFriendsList(id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        createdAt: Date;
        relationStatus: import(".prisma/client").RelationStatus;
    }, unknown> & {})[]>;
    findFriendship(user1_id: string, user2_id: string): Promise<string>;
    getUserStats(user_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user_id: string;
        wins: number;
        losses: number;
        ladder_level: number;
    }, unknown> & {}>;
    userMatchsRecord(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        player_1_id: string;
        player_2_id: string;
        result: string;
    }, unknown> & {})[]>;
    changeUserAvatar(user_id: string, newAvatarURI: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
        avatar: string;
        background: string;
        firstauth: boolean;
        status: import(".prisma/client").Status;
    }, unknown> & {}>;
    addWin(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user_id: string;
        wins: number;
        losses: number;
        ladder_level: number;
    }, unknown> & {}>;
    addLoss(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user_id: string;
        wins: number;
        losses: number;
        ladder_level: number;
    }, unknown> & {}>;
    createFriendShip(user1_id: string, user2_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        createdAt: Date;
        relationStatus: import(".prisma/client").RelationStatus;
    }, unknown> & {}>;
    deleteFriendship(friendship_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        createdAt: Date;
        relationStatus: import(".prisma/client").RelationStatus;
    }, unknown> & {}>;
    deleteUserAccount(user_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
        avatar: string;
        background: string;
        firstauth: boolean;
        status: import(".prisma/client").Status;
    }, unknown> & {}>;
    changeVisibily(user_id: string, status: 'IN_GAME' | 'ONLINE' | 'OFFLINE'): Promise<void>;
}
