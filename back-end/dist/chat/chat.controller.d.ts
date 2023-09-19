import { DmService } from './services/direct-messaging/dm.service';
import { Request } from "express";
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { channelDto } from './dto/chat.dto';
import { Reflector } from '@nestjs/core';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
export declare class ChatController {
    private readonly dmService;
    private readonly chatCrud;
    private readonly dmGate;
    private readonly reflector;
    constructor(dmService: DmService, chatCrud: ChatCrudService, dmGate: dmGateway, reflector: Reflector);
    findAll(request: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        user1_id: string;
        user2_id: string;
        status: import(".prisma/client").DmStatus;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getUserToDm(userToDm: string, request: Request, response: any): Promise<void>;
    findAllDm(request: Request, room: string, init: string): Promise<{
        dmUser: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            user1_id: string;
            user2_id: string;
            status: import(".prisma/client").DmStatus;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        roomsMesg: {};
        new_init: string;
    }>;
    createChannel(req: any, channelData: channelDto, response: any): Promise<void>;
    findAllChannels(request: Request, room: string): Promise<{
        dmUser: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            channel_id: string;
            user_id: string;
            role: import(".prisma/client").Role;
            joined_at: Date;
            is_banned: boolean;
            banned_at: Date;
        }, unknown> & {})[];
        roomsMesg: {};
    }>;
}
