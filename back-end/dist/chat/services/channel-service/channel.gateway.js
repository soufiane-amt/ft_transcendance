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
exports.channelGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_decorator_1 = require("../../decorators/chat.decorator");
const role_enum_1 = require("../../enum/role.enum");
const chat_guards_1 = require("../../guards/chat.guards");
const chat_crud_service_1 = require("../../../prisma/chat-crud.service");
const user_crud_service_1 = require("../../../prisma/user-crud.service");
let channelGateway = exports.channelGateway = class channelGateway {
    constructor(chatCrud, userCrud) {
        this.chatCrud = chatCrud;
        this.userCrud = userCrud;
    }
    async handleConnection(client, ...args) {
        const user_id = client.handshake.query.id;
        if (await this.userCrud.findUserByID(user_id) == null)
            throw new websockets_1.WsException("User not existing");
        console.log(`user ${user_id} connected\n`);
        (await this.chatCrud.findAllJoinedChannels(user_id)).forEach(room => {
            console.log("user : " + user_id + " joined " + room.channel_id);
            client.join(room.channel_id);
        });
    }
    async changeChannelPhoto(client, updatePic) {
        await this.chatCrud.changeChannelPhoto(updatePic.channel_id, updatePic.image);
    }
    async changeChannelType(client, updateType) {
        await this.chatCrud.changeChannelType(updateType.channel_id, updateType.type, updateType.password);
    }
    async changeChannelName(client, updateType) {
        await this.chatCrud.changeChannelName(updateType.channel_id, updateType.name);
    }
    async upgradeUserToAdmin(client, updateUserM) {
        await this.chatCrud.upgradeToAdmin(updateUserM.user_id, updateUserM.channel_id);
    }
    async handleJoinChannel(client, membReq) {
        console.log("Passed");
        const channelMembership = { channel_id: membReq.channel_id, user_id: membReq.user_id, role: 'USER' };
        await this.chatCrud.joinChannel(channelMembership);
        client.join(membReq.channel_id);
    }
    async handleChannelBan(client, banSignal) {
        if (banSignal.type == "BAN")
            await this.chatCrud.blockAUserWithinGroup(banSignal.user_id, banSignal.channel_id);
        else
            await this.chatCrud.unblockAUserWithinGroup(banSignal.user_id, banSignal.channel_id);
    }
    async handleChannelKicks(client, kickSignal) {
        await this.chatCrud.leaveChannel(kickSignal.user_id, kickSignal.channel_id);
        client.leave(kickSignal.channel_id);
    }
    handleSendMesDm(client, message) {
        console.log("---Dkhl---: ", message);
        this.server.to(message.channel_id).emit('message', message);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], channelGateway.prototype, "server", void 0);
__decorate([
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(chat_guards_1.channelPermission),
    (0, websockets_1.SubscribeMessage)('updateChannelPic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "changeChannelPhoto", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateChannelType'),
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(chat_guards_1.channelPermission),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "changeChannelType", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateChannelName'),
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(chat_guards_1.channelPermission),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "changeChannelName", null);
__decorate([
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(chat_guards_1.channelPermission),
    (0, websockets_1.SubscribeMessage)('upUserToAdmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "upgradeUserToAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinSignal'),
    (0, common_1.UseGuards)(chat_guards_1.allowJoinGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "handleJoinChannel", null);
__decorate([
    (0, common_1.UseGuards)(chat_guards_1.allowJoinGuard),
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, websockets_1.SubscribeMessage)("channelUserBanModerate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "handleChannelBan", null);
__decorate([
    (0, common_1.UseGuards)(chat_guards_1.allowJoinGuard),
    (0, chat_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, websockets_1.SubscribeMessage)("kickOutUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], channelGateway.prototype, "handleChannelKicks", null);
__decorate([
    (0, common_1.UseGuards)(chat_guards_1.userRoomSubscriptionGuard),
    (0, common_1.UseGuards)(chat_guards_1.bannedConversationGuard),
    (0, websockets_1.SubscribeMessage)("sendMsgCh"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], channelGateway.prototype, "handleSendMesDm", null);
exports.channelGateway = channelGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_crud_service_1.ChatCrudService,
        user_crud_service_1.UserCrudService])
], channelGateway);
//# sourceMappingURL=channel.gateway.js.map