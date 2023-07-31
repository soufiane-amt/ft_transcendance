import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ChatCrudService } from "src/prisma/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/prisma/user-crud.service";
import { DmService } from "../services/direct-messaging/dm.service";
import { WsException } from "@nestjs/websockets";
import { dmGateway } from "../services/direct-messaging/dm.gateway";

@Injectable()
export class cookieGuard implements CanActivate
{
    constructor ( private readonly userCrudService:UserCrudService){}

    async canActivate(context: ExecutionContext): Promise <boolean>{
        const request  = context.switchToHttp().getRequest()
        return (await this.userCrudService.findUserByID(request.cookies["user.id"]) != null)
    }
}

@Injectable()
export class FriendShipExistenceGuard implements CanActivate
{
    constructor (
        private readonly dmService :DmService){}

    async canActivate(context: ExecutionContext): Promise <boolean>{
        const request  = context.switchToHttp().getRequest()

        const user1_id = request.cookies["user.id"]
        const user2_id = request.params.uid;
        return (await this.dmService.checkFriendshipExistence(user1_id,user2_id) != null)
    }
}

//Room Existence


@Injectable()
export class userRoomSubscriptionGuard implements CanActivate
{
    constructor (
        private readonly dmService :DmService){}

    async canActivate(context: ExecutionContext): Promise <boolean>{
        if (context.getType() == "http")
        {
            const request  = context.switchToHttp().getRequest()
            const user_id = request.cookies["user.id"]
            if (context.getHandler().name == 'findAllDm')
                var room_id = request.params.id;
            return (await this.dmService.userJoinedChannel(user_id,room_id) != null)
        }
        else if (context.getType() == "ws")
        {
            const user_id  = context.switchToHttp().getRequest().handshake.query.id
            const packet_data = context.switchToWs().getData()
            if (context.getClass() == dmGateway)
                return await this.dmService.userJoinedChannel(packet_data.user_id, packet_data.dm_id) != null            
        }
        return true
    }
}


@Injectable()
export class bannedConversationGuard implements CanActivate {
  constructor(private readonly chatCrud: ChatCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const packet_data = context.switchToWs().getData()
    const dm_data = await this.chatCrud.findDmById (packet_data.dm_id)
    return dm_data.status == 'ALLOWED'
  }
}

