import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { DmService } from './dm.service';
import { MessageDto, banManageSignalDto } from '../../dto/chat.dto';
import { inboxPacketDto } from '../../dto/userInbox.dto';
import { Server, Socket } from 'socket.io';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
export declare class dmGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly dmService;
    private readonly userCrud;
    private readonly chatCrud;
    server: Server;
    constructor(dmService: DmService, userCrud: UserCrudService, chatCrud: ChatCrudService);
    handleConnection(client: any, ...args: any[]): Promise<void>;
    handleDisconnect(client: any): void;
    handleJoinInbox(client: Socket, inbox_id: string): void;
    deliver_to_inbox(client: Socket, packet: inboxPacketDto): void;
    handleJoinDm(client: any, dm_id: string): void;
    handleSendMesDm(client: any, message: MessageDto): void;
    handleDmBan(client: any, banSignal: banManageSignalDto): void;
}
