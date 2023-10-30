import { ChatCrudService } from '../../prisma/chat-crud.service';
import { UserCrudService } from 'src/prisma/user-crud.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DmService } from '../services/direct-messaging/dm.service';
import { dmGateway } from '../services/direct-messaging/dm.gateway';
import { Role } from '../enum/role.enum';
import {
  UserBanMuteSignalDto,
  banManageSignalDto,
  channelReqDto,
  kickSignalDto,
  setOwnerSignalDto,
} from '../dto/chat.dto';
import { UpdateChannelDto, UserRoleSignal } from '../dto/update-chat.dto';
import * as cookie from "cookie";


function extractUserIdFromCookies(client:Socket) {
  const headers = client.handshake.headers;
  const parsedCookies = cookie.parse(headers.cookie || "");
  return parsedCookies["user.id"];
}

@Injectable()
export class channelPermission implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    private readonly chatCrud: ChatCrudService,
    private readonly userCrud: UserCrudService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const user_id = extractUserIdFromCookies(context.switchToWs().getClient());
    const subscribedRoles = this.reflect.getAllAndOverride('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!subscribedRoles) return true;
    if (context.getType() == 'ws') {
      const data = context.switchToWs().getData();
      if ( context.getHandler().name === 'changeChannelType')
        return  this.verifyChangeChannelType(user_id, data, subscribedRoles);
      if (context.getHandler().name === 'handleChannelBan')
        return this.verifyMuteBanPermission(user_id, data, subscribedRoles);
      if (context.getHandler().name === 'handleChannelUnBan' || context.getHandler().name === 'handleChannelUnMute')
        return this.verifyUnBanUnMutePermission(user_id, data, subscribedRoles);
      if (context.getHandler().name === 'upgradeUserToAdmin' ||
            context.getHandler().name === 'upgradeAdminToUser')
        return this.verifyGradeUpdatePermission(user_id, data, subscribedRoles);
      if (context.getHandler().name === 'handleChannelKicks')
        return this.verifyPermissionToKickUser(user_id, data, subscribedRoles);
      if (context.getHandler().name === 'handleGradeUserTOwner')
        return this.verifyPermissionGradeUserTOwner(user_id, data, subscribedRoles);
    }
    return false;
  }
 
  // async verifyKickData(
  //   update: kickSignalDto,
  //   subscribedRoles: Role[],
  // ): Promise<boolean> {
  //   const targetedMember = await this.chatCrud.getMemeberShip(
  //     update.user_id,
  //     update.channel_id,
  //   );
  //   const memberToAct = await this.chatCrud.getMemeberShip(
  //     update.kicker_id,
  //     update.channel_id,
  //   );
  //   if (!targetedMember || !memberToAct) return false;
  //   if (
  //     subscribedRoles.some((role) => memberToAct.role.includes(role)) &&
  //     !subscribedRoles.some((role) => targetedMember.role.includes(role))
  //   )
  //     return true;
  //   return false;
  // }

    async verifyMuteBanPermission(
      user_id: string,
      update: UserBanMuteSignalDto,
      subscribedRoles: Role[],
    ): Promise<boolean> {
      const targetedMember = await this.chatCrud.getMemeberShip(
      await this.userCrud.findUserByUsername(update.target_username),
      update.channel_id,
    );
    const memberToAct = await this.chatCrud.getMemeberShip(
      user_id,
      update.channel_id,
    );
    if (!targetedMember || !memberToAct) return false;
    if (memberToAct.is_banned || targetedMember.is_banned || targetedMember.is_muted) return false;
    if (
      subscribedRoles.some((role) => memberToAct.role.includes(role)) &&
      targetedMember.role != 'OWNER')
      return true;
    return false;
  }

  async verifyUnBanUnMutePermission(
    user_id: string,
    update: UserBanMuteSignalDto,
    subscribedRoles: Role[],
  ): Promise<boolean> {
    const targetedMember = await this.chatCrud.getMemeberShip(
      await this.userCrud.findUserByUsername(update.target_username),
      update.channel_id,
    );
    const memberToAct = await this.chatCrud.getMemeberShip(
      user_id,
      update.channel_id,
    );
    if (!targetedMember || !memberToAct) return false;
    if (memberToAct.is_banned ) return false;
    if (
      subscribedRoles.some((role) => memberToAct.role.includes(role)) &&
      targetedMember.role != 'OWNER')
      return true;
    return false;
  }

  async verifyChangeChannelType(
    user_id: string,
    updateChannel: UpdateChannelDto,
    subscribedRoles: Role[],
  ): Promise<boolean> {
    const membership = await this.chatCrud.getMemeberShip(
      user_id,
      updateChannel.channel_id,
    );
    if (!membership) return false;
    if (subscribedRoles.some((role) => membership.role.includes(role)))
      return true;
    return false;
  }

  async verifyGradeUpdatePermission (
    user_id: string,
    updateChannel: UserRoleSignal,
    subscribedRoles: Role[],
  )
  {
    const membership = await this.chatCrud.getMemeberShip(
      user_id,
      updateChannel.channel_id,
    );
    if (!membership) return false;
    if (subscribedRoles.some((role) => membership.role.includes(role)))
      return true;
    return false;
  }  
  
  async verifyPermissionToKickUser (
    user_id: string,
    kickAction: kickSignalDto,
    subscribedRoles: Role[],
  )
  {
    const membership = await this.chatCrud.getMemeberShip(
      user_id,
      kickAction.channel_id,
    );
    if (!membership) return false;
    if (subscribedRoles.some((role) => membership.role.includes(role)))
      return true;
    return false;
  }

  async verifyPermissionGradeUserTOwner (
    user_id: string,
    signal: setOwnerSignalDto,
    subscribedRoles: Role[],
  )
  {
    const membership = await this.chatCrud.getMemeberShip(
      await this.userCrud.findUserByUsername(signal.targeted_username),
      signal.channel_id,
    );
    if (!membership) return false;
    if (subscribedRoles.some((role) => membership.role.includes(role)))
      return true;
    return false;
  }
}






@Injectable()
export class allowJoinGuard implements CanActivate {
  constructor(private readonly chatCrud: ChatCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const joinRequest = context.switchToWs().getData();
    return this.allowJoining(joinRequest);
  }

  async allowJoining(joinRequest: channelReqDto): Promise<boolean> {
    const targetedChannel = await this.chatCrud.findChannelById(
      joinRequest.channel_id,
    );
    console.log('1');
    if (!targetedChannel) return false;
    console.log('2');
    //check if the user wanting to join is already there in  join
    const user_membership = await this.chatCrud.getMemeberShip(
      joinRequest.user_id,
      joinRequest.channel_id,
    );
    if (user_membership == null) {
      console.log('3');

      if (
        targetedChannel.type == 'PROTECTED' &&
        (!joinRequest.password ||
          joinRequest.password != targetedChannel.password)
      )
        return false;
      return true;
    }
    if (user_membership.role == 'OWNER')
      //this condition checks wether the channel is just created, and the owner is requesting to join its own channel
      return true;
    console.log('4');
    return false;
  }
}

@Injectable()
export class cookieGuard implements CanActivate {
  constructor(private readonly userCrudService: UserCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      return (
        (await this.userCrudService.findUserByID(
          request.cookies['user.id'],
        )) !== null
      );
    } catch {
      return false;
    }
  }
}

@Injectable()
export class FriendShipExistenceGuard implements CanActivate {
  constructor(private readonly dmService: DmService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user1_id = request.cookies['user.id'];
    const user2_id = request.params.uid;
    return (
      (await this.dmService.checkFriendshipExistence(user1_id, user2_id)) !=
      null
    );
  }
}

//Room Existence

@Injectable()
export class userRoomSubscriptionGuard implements CanActivate {
  constructor(
    private readonly chatCrud: ChatCrudService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() == 'http') {
      const request = context.switchToHttp().getRequest();
      const user_id = request.cookies['user.id'];
      if (context.getHandler().name == 'findRoomMessages')
      {
        var room_id = request.params.roomid;
        const userIsSubscribed = await this.chatCrud.isUserInRoom(user_id, room_id);
        return userIsSubscribed.isInDMTable || userIsSubscribed.isInMembershipTable;
      }
      if (context.getHandler().name == 'markMessagesAsRead')
      {
        var room_id = request.params.room.id;
        const userIsSubscribed = await this.chatCrud.isUserInRoom(user_id, room_id);
        return userIsSubscribed.isInDMTable || userIsSubscribed.isInMembershipTable;
      }
    } else if (context.getType() == 'ws') {
      const packet_data = context.switchToWs().getData();
      const user_id = extractUserIdFromCookies(context.switchToWs().getClient());
      if (context.getClass() == dmGateway)
        if (this.verfiyDirectMessagingSubscription(context, packet_data, user_id))
          return true;
      if (context.getClass() == channelGateway)
        return (
          (await this.chatCrud.getMemeberShip(
            packet_data.user_id,
            packet_data.channel_id,
          )) != null
        );
    }
    return true;
  }

  async verfiyDirectMessagingSubscription(context:ExecutionContext , packet_data:any , user_id: string) {
    console.log('packet_data: ', packet_data)
    if (context.getHandler().name == 'handleSendMesDm')
        return (
        (await this.chatCrud.checkUserInDm(
            user_id,
            packet_data.dm_id,
          )) != null
        );
    else if (context.getHandler().name == 'handleMarkMsgAsRead')
        return (
          (await this.chatCrud.checkUserInDm(
            user_id,
            packet_data._id,
          )) != null
        );
    else if (context.getHandler().name == 'handleDmBan')
      {
        const dm = this.chatCrud.findDmByUsers(
          user_id,
          packet_data.targetedUserId
        );
        
        return (
        (await this.chatCrud.checkUserInDm(
          user_id,
          (await dm).id,
        )) != null
        );
      }
  }
}




@Injectable()
export class bannedConversationGuard implements CanActivate {
  constructor(private readonly chatCrud: ChatCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const packet_data = context.switchToWs().getData();
    const user_id = extractUserIdFromCookies(context.switchToWs().getClient());
    if (context.getClass() == dmGateway) {
      const dm_data = await this.chatCrud.findDmById(packet_data.dm_id);
      return dm_data.status == 'ALLOWED';
    } else {
      const memeberShip = await this.chatCrud.getMemeberShip(
        user_id,
        packet_data.channel_id
      );
      return memeberShip?.is_banned == false;
    }
  }
}

@Injectable()
export class muteConversationGuard implements CanActivate {
  constructor(private readonly chatCrud: ChatCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const packet_data = context.switchToWs().getData();
    const user_id = extractUserIdFromCookies(context.switchToWs().getClient());
    if (context.getClass() == channelGateway) {
      const memeberShip = await this.chatCrud.getMemeberShip(
        user_id,
        packet_data.channel_id
      );
      return memeberShip?.is_muted == false;
    }
  }
}

@Injectable()
export class userCanBeIntegratedInConversation implements CanActivate {
  constructor(private readonly chatCrud: ChatCrudService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const packet_data = context.switchToWs().getData();
    const user_id = extractUserIdFromCookies(context.switchToWs().getClient());
    if (context.getClass() == channelGateway) {
      const memeberShip = await this.chatCrud.getMemeberShip(
        user_id,
        packet_data.channel_id
      );
      return memeberShip?.is_muted == false;
    }
  }
}
import { channelGateway } from '../services/channel-service/channel.gateway';import { Socket } from 'socket.io';
import { User } from '@prisma/client';

