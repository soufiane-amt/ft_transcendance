"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannedConversationGuard = exports.userRoomSubscriptionGuard = exports.FriendShipExistenceGuard = exports.cookieGuard = exports.allowJoinGuard = exports.channelPermission = void 0;
const chat_crud_service_1 = require("../../prisma/chat-crud.service");
const user_crud_service_1 = require("../../prisma/user-crud.service");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const dm_service_1 = require("../services/direct-messaging/dm.service");
const dm_gateway_1 = require("../services/direct-messaging/dm.gateway");
let channelPermission = exports.channelPermission = class channelPermission {
    constructor(reflect, chatCrud) {
        this.reflect = reflect;
        this.chatCrud = chatCrud;
    }
    canActivate(context) {
        const subscribedRoles = this.reflect.getAllAndOverride('roles', [
            context.getClass(),
            context.getHandler(),
        ]);
        if (!subscribedRoles)
            return true;
        if (context.getType() == 'ws') {
            const data = context.switchToWs().getData();
            if (context.getHandler().name ==
                ('changeChannelPhoto' ||
                    'changeChannelType' ||
                    'changeChannelName' ||
                    'upgradeUserToAdmin'))
                return this.verifyModificatData(data, subscribedRoles);
            if (context.getHandler().name == 'handleChannelBan')
                return this.verifyBanData(data, subscribedRoles);
            if (context.getHandler().name == 'handleChannelKicks')
                return this.verifyKickData(data, subscribedRoles);
        }
        return false;
    }
    async verifyKickData(update, subscribedRoles) {
        const targetedMember = await this.chatCrud.getMemeberShip(update.user_id, update.channel_id);
        const memberToAct = await this.chatCrud.getMemeberShip(update.kicker_id, update.channel_id);
        if (!targetedMember || !memberToAct)
            return false;
        if (subscribedRoles.some((role) => memberToAct.role.includes(role)) &&
            !subscribedRoles.some((role) => targetedMember.role.includes(role)))
            return true;
        return false;
    }
    async verifyBanData(update, subscribedRoles) {
        const targetedMember = await this.chatCrud.getMemeberShip(update.user_id, update.channel_id);
        const memberToAct = await this.chatCrud.getMemeberShip(update.banner_id, update.channel_id);
        if (!targetedMember || !memberToAct)
            return false;
        if (subscribedRoles.some((role) => memberToAct.role.includes(role)) &&
            !subscribedRoles.some((role) => targetedMember.role.includes(role)))
            return true;
        return false;
    }
    async verifyModificatData(updateChannel, subscribedRoles) {
        const membership = await this.chatCrud.getMemeberShip(updateChannel.user_id, updateChannel.channel_id);
        if (!membership)
            return false;
        if (subscribedRoles.some((role) => membership.role.includes(role)))
            return true;
        return false;
    }
};
exports.channelPermission = channelPermission = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        chat_crud_service_1.ChatCrudService])
], channelPermission);
let allowJoinGuard = exports.allowJoinGuard = class allowJoinGuard {
    constructor(chatCrud) {
        this.chatCrud = chatCrud;
    }
    async canActivate(context) {
        const joinRequest = context.switchToWs().getData();
        return this.allowJoining(joinRequest);
    }
    async allowJoining(joinRequest) {
        const targetedChannel = await this.chatCrud.findChannelById(joinRequest.channel_id);
        console.log('1');
        if (!targetedChannel)
            return false;
        console.log('2');
        const user_membership = await this.chatCrud.getMemeberShip(joinRequest.user_id, joinRequest.channel_id);
        if (user_membership == null) {
            console.log('3');
            if (targetedChannel.type == 'PROTECTED' &&
                (!joinRequest.password ||
                    joinRequest.password != targetedChannel.password))
                return false;
            return true;
        }
        if (user_membership.role == 'OWNER')
            return true;
        console.log('4');
        return false;
    }
};
exports.allowJoinGuard = allowJoinGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_crud_service_1.ChatCrudService])
], allowJoinGuard);
let cookieGuard = exports.cookieGuard = class cookieGuard {
    constructor(userCrudService) {
        this.userCrudService = userCrudService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        try {
            return ((await this.userCrudService.findUserByID(request.cookies['user.id'])) !== null);
        }
        catch {
            return false;
        }
    }
};
exports.cookieGuard = cookieGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_crud_service_1.UserCrudService])
], cookieGuard);
let FriendShipExistenceGuard = exports.FriendShipExistenceGuard = class FriendShipExistenceGuard {
    constructor(dmService) {
        this.dmService = dmService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user1_id = request.cookies['user.id'];
        const user2_id = request.params.uid;
        return ((await this.dmService.checkFriendshipExistence(user1_id, user2_id)) !=
            null);
    }
};
exports.FriendShipExistenceGuard = FriendShipExistenceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dm_service_1.DmService])
], FriendShipExistenceGuard);
let userRoomSubscriptionGuard = exports.userRoomSubscriptionGuard = class userRoomSubscriptionGuard {
    constructor(dmService, chatCrud) {
        this.dmService = dmService;
        this.chatCrud = chatCrud;
    }
    async canActivate(context) {
        if (context.getType() == 'http') {
            const request = context.switchToHttp().getRequest();
            const user_id = request.cookies['user.id'];
            if (context.getHandler().name == 'findAllDm')
                var room_id = request.params.id;
            return (await this.chatCrud.checkUserInDm(user_id, room_id)) != null;
        }
        else if (context.getType() == 'ws') {
            const packet_data = context.switchToWs().getData();
            if (context.getClass() == dm_gateway_1.dmGateway)
                return ((await this.chatCrud.checkUserInDm(packet_data.user_id, packet_data.dm_id)) != null);
            if (context.getClass() == channel_gateway_1.channelGateway)
                return ((await this.chatCrud.getMemeberShip(packet_data.user_id, packet_data.channel_id)) != null);
        }
        return true;
    }
};
exports.userRoomSubscriptionGuard = userRoomSubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dm_service_1.DmService,
        chat_crud_service_1.ChatCrudService])
], userRoomSubscriptionGuard);
let bannedConversationGuard = exports.bannedConversationGuard = class bannedConversationGuard {
    constructor(chatCrud) {
        this.chatCrud = chatCrud;
    }
    async canActivate(context) {
        const packet_data = context.switchToWs().getData();
        if (context.getClass() == dm_gateway_1.dmGateway) {
            const dm_data = await this.chatCrud.findDmById(packet_data.dm_id);
            return dm_data.status == 'ALLOWED';
        }
        else {
            const memeberShip = await this.chatCrud.getMemeberShip(packet_data.channel_id, packet_data.user_id);
            return memeberShip?.is_banned != false;
        }
    }
};
exports.bannedConversationGuard = bannedConversationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_crud_service_1.ChatCrudService])
], bannedConversationGuard);
const channel_gateway_1 = require("../services/channel-service/channel.gateway");
//# sourceMappingURL=chat.guards.js.map