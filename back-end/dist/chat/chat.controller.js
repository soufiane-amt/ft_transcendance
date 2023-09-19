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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const dm_service_1 = require("./services/direct-messaging/dm.service");
const dm_gateway_1 = require("./services/direct-messaging/dm.gateway");
const chat_guards_1 = require("./guards/chat.guards");
const core_1 = require("@nestjs/core");
const chat_crud_service_1 = require("../prisma/chat-crud.service");
let ChatController = exports.ChatController = class ChatController {
    constructor(dmService, chatCrud, dmGate, reflector) {
        this.dmService = dmService;
        this.chatCrud = chatCrud;
        this.dmGate = dmGate;
        this.reflector = reflector;
    }
    async findAll(request) {
        const rooms = await this.chatCrud.retrieveUserDmChannels(request.cookies["user.id"]);
        console.log(request.cookies["user.id"]);
        return (rooms);
    }
    async getUserToDm(userToDm, request, response) {
        const user_id = request.cookies["user.id"];
        var dmRoom_id = await this.dmService.checkDmTableExistence(user_id, userToDm);
        if (!dmRoom_id) {
            dmRoom_id = await this.dmService.createDmTable(user_id, userToDm);
            var init_stat = '?init=true';
        }
        else
            init_stat = `?init=false`;
        console.log(`/chat/direct_messaging/@me/${dmRoom_id}/${init_stat}`);
        response.redirect(`/chat/direct_messaging/@me/${dmRoom_id}/${init_stat}`);
    }
    async findAllDm(request, room, init) {
        const allRoomMessages = await this.chatCrud.retrieveRoomMessages(room);
        const dmUsers = await this.chatCrud.retrieveUserDmChannels(request.cookies["user.id"]);
        return { dmUser: dmUsers, roomsMesg: allRoomMessages, new_init: init };
    }
    async createChannel(req, channelData, response) {
        const channel_id = await this.chatCrud.createChannel(req.cookies["user.id"], channelData);
        response.redirect(`/chat/channels/@me/${channel_id}`);
    }
    async findAllChannels(request, room) {
        const allRoomMessages = await this.chatCrud.retrieveRoomMessages(room);
        const channels = await this.chatCrud.findAllJoinedChannels(request.cookies["user.id"]);
        return { dmUser: channels, roomsMesg: allRoomMessages };
    }
};
__decorate([
    (0, common_1.Get)("/direct_messaging"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/direct_messaging/:uid"),
    (0, common_1.UseGuards)(chat_guards_1.FriendShipExistenceGuard),
    __param(0, (0, common_1.Param)("uid")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserToDm", null);
__decorate([
    (0, common_1.Get)('/direct_messaging/@me/:id'),
    (0, common_1.UseGuards)(chat_guards_1.userRoomSubscriptionGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("init")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAllDm", null);
__decorate([
    (0, common_1.Post)("channels/createChannel"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Get)('channels/@me/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAllChannels", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __param(2, (0, common_1.Inject)(dm_gateway_1.dmGateway)),
    __metadata("design:paramtypes", [dm_service_1.DmService,
        chat_crud_service_1.ChatCrudService,
        dm_gateway_1.dmGateway,
        core_1.Reflector])
], ChatController);
//# sourceMappingURL=chat.controller.js.map