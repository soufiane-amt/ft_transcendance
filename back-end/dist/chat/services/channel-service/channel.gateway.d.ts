import { OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageDto, banManageSignalDto, channelReqDto, kickSignalDto } from "src/chat/dto/chat.dto";
import { UpdateChannelDto, UpdateUserMemberShip } from "src/chat/dto/update-chat.dto";
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";
export declare class channelGateway implements OnGatewayConnection {
    private readonly chatCrud;
    private readonly userCrud;
    server: Server;
    constructor(chatCrud: ChatCrudService, userCrud: UserCrudService);
    handleConnection(client: any, ...args: any[]): Promise<void>;
    changeChannelPhoto(client: Socket, updatePic: UpdateChannelDto): Promise<void>;
    changeChannelType(client: Socket, updateType: UpdateChannelDto): Promise<void>;
    changeChannelName(client: Socket, updateType: UpdateChannelDto): Promise<void>;
    upgradeUserToAdmin(client: Socket, updateUserM: UpdateUserMemberShip): Promise<void>;
    handleJoinChannel(client: Socket, membReq: channelReqDto): Promise<void>;
    handleChannelBan(client: any, banSignal: banManageSignalDto): Promise<void>;
    handleChannelKicks(client: any, kickSignal: kickSignalDto): Promise<void>;
    handleSendMesDm(client: any, message: MessageDto): void;
}
