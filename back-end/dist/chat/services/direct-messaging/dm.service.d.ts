import { MessageDto } from '../../dto/chat.dto';
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
export declare class DmService {
    private readonly chatCrudService;
    private readonly userCrudService;
    constructor(chatCrudService: ChatCrudService, userCrudService: UserCrudService);
    checkFriendshipExistence(user1_id: string, user2_id: string): Promise<string>;
    checkDmTableExistence(user1_id: string, user2_id: string): Promise<string>;
    createDmTable(user1_id: string, user2_id: string): Promise<string>;
    storeMessageInDb(message: MessageDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user_id: string;
        channel_id: string;
        dm_id: string;
        content: string;
        createdAt: Date;
        is_read: boolean;
    }, unknown> & {}>;
}
