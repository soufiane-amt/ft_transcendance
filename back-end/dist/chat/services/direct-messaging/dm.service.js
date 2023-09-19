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
exports.DmService = void 0;
const common_1 = require("@nestjs/common");
const chat_crud_service_1 = require("../../../prisma/chat-crud.service");
const user_crud_service_1 = require("../../../prisma/user-crud.service");
let DmService = exports.DmService = class DmService {
    constructor(chatCrudService, userCrudService) {
        this.chatCrudService = chatCrudService;
        this.userCrudService = userCrudService;
    }
    async checkFriendshipExistence(user1_id, user2_id) {
        try {
            return await this.userCrudService.findFriendship(user1_id, user2_id);
        }
        catch (error) {
            return (null);
        }
        return (null);
    }
    async checkDmTableExistence(user1_id, user2_id) {
        try {
            return await this.chatCrudService.getDmTable(user1_id, user2_id);
        }
        catch {
            return null;
        }
    }
    async createDmTable(user1_id, user2_id) {
        return await this.chatCrudService.createDm({ user1_id, user2_id, status: 'ALLOWED' });
    }
    async storeMessageInDb(message) {
        return await this.chatCrudService.createMessage(message);
    }
};
exports.DmService = DmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_crud_service_1.ChatCrudService, user_crud_service_1.UserCrudService])
], DmService);
//# sourceMappingURL=dm.service.js.map