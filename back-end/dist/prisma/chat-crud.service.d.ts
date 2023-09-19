import { PrismaService } from './prisma.service';
import { MessageDto, channelDto, channelMembershipDto, dmDto } from 'src/chat/dto/chat.dto';
export declare class ChatCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createChannel(user_id: string, data: channelDto): Promise<string>;
    joinChannel(data: channelMembershipDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {}>;
    findChannelById(channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findDmById(dm_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findChannelsByType(channel_type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED'): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    createDm(data: dmDto): Promise<string>;
    getDmTable(user1_id: string, user2_id: string): Promise<string>;
    retrieveUserDmChannels(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    findAllChannelsAvailbleToJoin(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    findAllJoinedChannels(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {})[]>;
    retrieveRoomMessages(room_id: string): Promise<{}>;
    retieveBlockedUsersList(user_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        createdAt: Date;
        relationStatus: import(".prisma/client").RelationStatus;
    }, unknown> & {})[]>;
    retieveBlockedChannelUsers(channel_id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {})[]>;
    changeChannelPhoto(channel_id: string, newAvatarURI: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    changeChannelType(channel_id: string, new_type: 'PUBLIC' | 'PROTECTED' | 'PRIVATE', new_pass: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    changeChannelName(channel_id: string, new_name: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        type: import(".prisma/client").Channel_type;
        name: string;
        image: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    blockAUserWithinGroup(user_id: string, channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {}>;
    unblockAUserWithinGroup(user_id: string, channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {}>;
    blockAUserWithDm(dm_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    unblockAUserWithDm(channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    leaveChannel(user_id: string, channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {}>;
    deleteChannel(channel_id: string): Promise<void>;
    createMessage(data: MessageDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user_id: string;
        channel_id: string;
        dm_id: string;
        content: string;
        createdAt: Date;
        is_read: boolean;
    }, unknown> & {}>;
    deleteMessage(message_id: string): Promise<void>;
    editMessage(message_id: string, content: string): Promise<void>;
    upgradeToAdmin(user_id: string, channel_id: string): Promise<void>;
    setGradeToUser(user_id: string, channel_id: string): Promise<void>;
    getMemeberShip(user_id: string, channel_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        channel_id: string;
        user_id: string;
        role: import(".prisma/client").Role;
        joined_at: Date;
        is_banned: boolean;
        banned_at: Date;
    }, unknown> & {}>;
    makeOwner(user_id: string, channel_id: string): Promise<void>;
    checkUserInDm(user_id: string, room_id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
