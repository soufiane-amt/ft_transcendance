"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const dm_service_1 = require("./services/direct-messaging/dm.service");
const chat_controller_1 = require("./chat.controller");
const dm_gateway_1 = require("./services/direct-messaging/dm.gateway");
const channel_gateway_1 = require("./services/channel-service/channel.gateway");
const prisma_module_1 = require("../prisma/prisma.module");
let ChatModule = exports.ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        providers: [dm_service_1.DmService, dm_gateway_1.dmGateway, channel_gateway_1.channelGateway],
        controllers: [chat_controller_1.ChatController],
        imports: [prisma_module_1.PrismaModule]
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map