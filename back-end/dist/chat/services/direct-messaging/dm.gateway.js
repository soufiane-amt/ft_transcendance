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
exports.dmGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const dm_service_1 = require("./dm.service");
const socket_io_1 = require("socket.io");
const chat_guards_1 = require("../../guards/chat.guards");
const common_1 = require("@nestjs/common");
const user_crud_service_1 = require("../../../prisma/user-crud.service");
const chat_crud_service_1 = require("../../../prisma/chat-crud.service");
let dmGateway = exports.dmGateway = class dmGateway {
    constructor(dmService, userCrud, chatCrud) {
        this.dmService = dmService;
        this.userCrud = userCrud;
        this.chatCrud = chatCrud;
    }
    async handleConnection(client, ...args) {
        const user_id = client.handshake.query.id;
        if (await this.userCrud.findUserByID(user_id) == null)
            throw new websockets_1.WsException("User not existing");
        console.log(`user ${user_id} connected\n`);
        const inbox_id = "inbox-".concat(user_id);
        client.join(inbox_id);
        (await this.chatCrud.retrieveUserDmChannels(user_id)).forEach(room => {
            client.join("dm-" + room.id);
        });
    }
    handleDisconnect(client) {
        console.log(`User disconnected: ID=${client.id}`);
    }
    handleJoinInbox(client, inbox_id) {
        console.log(`${client.id} is connected to ${inbox_id}`);
        client.join(inbox_id);
    }
    deliver_to_inbox(client, packet) {
        this.server.to(packet.inbox_id).emit('inboxMsg', "hello");
        this.server.to("inbox-" + packet.sender_id).emit('inboxMsg', "hello");
    }
    handleJoinDm(client, dm_id) {
        client.join(dm_id);
    }
    handleSendMesDm(client, message) {
        console.log("----messge sent----");
        this.server.to(message.dm_id).emit('message', message.content);
    }
    handleDmBan(client, banSignal) {
        if (banSignal.type == "BAN")
            this.chatCrud.blockAUserWithDm(banSignal.dm_id);
        else
            this.chatCrud.unblockAUserWithDm(banSignal.dm_id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], dmGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinInbox'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], dmGateway.prototype, "handleJoinInbox", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toInbox'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], dmGateway.prototype, "deliver_to_inbox", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinDm"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], dmGateway.prototype, "handleJoinDm", null);
__decorate([
    (0, common_1.UseGuards)(chat_guards_1.userRoomSubscriptionGuard),
    (0, common_1.UseGuards)(chat_guards_1.bannedConversationGuard),
    (0, websockets_1.SubscribeMessage)("sendMsgDm"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], dmGateway.prototype, "handleSendMesDm", null);
__decorate([
    (0, common_1.UseGuards)(chat_guards_1.userRoomSubscriptionGuard),
    (0, websockets_1.SubscribeMessage)("dmModeration"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], dmGateway.prototype, "handleDmBan", null);
exports.dmGateway = dmGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [dm_service_1.DmService,
        user_crud_service_1.UserCrudService, chat_crud_service_1.ChatCrudService])
], dmGateway);
//# sourceMappingURL=dm.gateway.js.map