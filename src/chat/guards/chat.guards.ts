import { CanActivate, ExecutionContext, Injectable,SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ChatCrudService } from "src/prisma/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/prisma/user-crud.service";
import { DmService } from "../services/direct-messaging/dm.service";
import { dmGateway } from "../services/direct-messaging/dm.gateway";
import { Role } from "../enum/role.enum";
import { Observable } from "rxjs";
import { channelReqDto } from "../dto/chat.dto";


//Setting metadata aliases
export const KEY_ROLE = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);


@Injectable()
export  class channelPermission implements CanActivate
{
    constructor (private  readonly reflect :Reflector, private readonly chatCrud : ChatCrudService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean>  {
         const subscribedRoles = this.reflect.getAllAndOverride ('roles', [context.getClass(), context.getHandler()])
         if (!subscribedRoles)
            return true
        if (context.getType() == 'ws')
        {
            const data = context.switchToWs ().getData()
            return this.verifyData (data.user_id, data.channel_id, subscribedRoles)
        }
        return false
    }

    async verifyData (user_id : string, channel_id : string, subscribedRoles :Role[]) : Promise<boolean>
    {
        const membership = await this.chatCrud.getMemeberShip(user_id, channel_id)
        if (!membership)
            return false
        if (subscribedRoles.some((role) => membership.role.includes(role)))
            return true
        return false
    }
}


@Injectable()
export class allowJoinGuard implements CanActivate
{
    constructor ( private readonly chatCrud:ChatCrudService){}

    async canActivate(context: ExecutionContext): Promise <boolean>{
        const joinRequest = context.switchToWs().getData()
        return this.allowJoining (joinRequest)
    }

    async allowJoining (joinRequest : channelReqDto) : Promise<boolean>
    {
        const targetedChannel = await this.chatCrud.findChannelById(joinRequest.channel_id)
        if (!targetedChannel)
            return false
        
            //check if the user wanting to join is already there in  join 
        if (await this.chatCrud.getMemeberShip (joinRequest.user_id, joinRequest.channel_id) == null)
        {
            if (!joinRequest.password || (targetedChannel.type == 'PROTECTED' && 
                            joinRequest.password != targetedChannel.password))
                return false
            return true 
        }
        return false
    }

}



@Injectable()
export class cookieGuard implements CanActivate
{
    constructor ( private readonly userCrudService:UserCrudService){}

    async canActivate(context: ExecutionContext): Promise <boolean>{
        const request  = context.switchToHttp().getRequest()
        try 
        {
            return (await this.userCrudService.findUserByID(request.cookies["user.id"]) !== null)
        }
        catch
        {
            return false
        }
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
