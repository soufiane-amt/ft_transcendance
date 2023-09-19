import { ChatCrudService } from '../../prisma/chat-crud.service';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DmService } from '../services/direct-messaging/dm.service';
import { Role } from '../enum/role.enum';
import { banManageSignalDto, channelReqDto, kickSignalDto } from '../dto/chat.dto';
import { UpdateChannelDto } from '../dto/update-chat.dto';
export declare class channelPermission implements CanActivate {
    private readonly reflect;
    private readonly chatCrud;
    constructor(reflect: Reflector, chatCrud: ChatCrudService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
    verifyKickData(update: kickSignalDto, subscribedRoles: Role[]): Promise<boolean>;
    verifyBanData(update: banManageSignalDto, subscribedRoles: Role[]): Promise<boolean>;
    verifyModificatData(updateChannel: UpdateChannelDto, subscribedRoles: Role[]): Promise<boolean>;
}
export declare class allowJoinGuard implements CanActivate {
    private readonly chatCrud;
    constructor(chatCrud: ChatCrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    allowJoining(joinRequest: channelReqDto): Promise<boolean>;
}
export declare class cookieGuard implements CanActivate {
    private readonly userCrudService;
    constructor(userCrudService: UserCrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class FriendShipExistenceGuard implements CanActivate {
    private readonly dmService;
    constructor(dmService: DmService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class userRoomSubscriptionGuard implements CanActivate {
    private readonly dmService;
    private readonly chatCrud;
    constructor(dmService: DmService, chatCrud: ChatCrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class bannedConversationGuard implements CanActivate {
    private readonly chatCrud;
    constructor(chatCrud: ChatCrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
