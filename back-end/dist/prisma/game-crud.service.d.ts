import { PrismaService } from './prisma.service';
import { matchDto } from 'src/chat/dto/match.dto';
export declare class GameCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createGame(data: matchDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        player_1_id: string;
        player_2_id: string;
        result: string;
    }, unknown> & {}>;
    retieveAllGamerecords(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        player_1_id: string;
        player_2_id: string;
        result: string;
    }, unknown> & {})[]>;
}
