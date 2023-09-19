"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const chat_crud_service_1 = require("./chat-crud.service");
const user_crud_service_1 = require("./user-crud.service");
const game_crud_service_1 = require("./game-crud.service");
let PrismaModule = exports.PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService, chat_crud_service_1.ChatCrudService, user_crud_service_1.UserCrudService, game_crud_service_1.GameCrudService],
        exports: [prisma_service_1.PrismaService, chat_crud_service_1.ChatCrudService, user_crud_service_1.UserCrudService, game_crud_service_1.GameCrudService]
    })
], PrismaModule);
//# sourceMappingURL=prisma.module.js.map