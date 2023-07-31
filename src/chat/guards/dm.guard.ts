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
            const msg = context.switchToWs().getData()
            if (context.getClass() == dmGateway)
                return await this.dmService.userJoinedChannel(msg.user_id, msg.dm_id) != null            
            }
        return true
    }
}


@Injectable()
export class UserExistenceGuard implements CanActivate {
  constructor(private readonly chatCrudService: ChatCrudService, private readonly dmService: DmService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const user_id = client.handshake.query.id; // Assuming you are passing 'id' as a query parameter during WebSocket handshake
    // Perform your guard logic here based on user_id
    // const userExists = await this.dmService.checkUserExists(user_id);
    // if (!userExists) {
    //   throw new WsException('User does not exist.');
    // }
    return true;
  }
}

