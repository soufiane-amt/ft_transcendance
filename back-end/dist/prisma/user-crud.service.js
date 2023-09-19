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
exports.UserCrudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let UserCrudService = exports.UserCrudService = class UserCrudService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserByID(userId) {
        return await this.prisma.prismaClient.user.findUnique({
            where: {
                id: userId
            }
        });
    }
    async findUserByUsername(username) {
        const user = await this.prisma.prismaClient.user.findUnique({
            where: {
                username: username
            },
            select: {
                id: true
            }
        });
        return user ? user.id : null;
    }
    async findFriendsList(id) {
        return this.prisma.prismaClient.friendships.findMany({
            where: {
                OR: [
                    { user1_id: id },
                    { user2_id: id },
                ]
            }
        });
    }
    async findFriendship(user1_id, user2_id) {
        const friendship = await this.prisma.prismaClient.friendships.findUnique({
            where: {
                user1_id: user1_id,
                user2_id: user2_id
            },
            select: {
                id: true
            }
        });
        return friendship ? friendship.id : null;
    }
    async getUserStats(user_id) {
        return this.prisma.prismaClient.stats.findUnique({
            where: {
                user_id: user_id,
            }
        });
    }
    async userMatchsRecord(user_id) {
        return this.prisma.prismaClient.match.findMany({
            where: {
                OR: [
                    { player_1_id: user_id },
                    { player_2_id: user_id },
                ],
            }
        });
    }
    async changeUserAvatar(user_id, newAvatarURI) {
        return this.prisma.prismaClient.user.update({
            where: { id: user_id },
            data: {
                avatar: newAvatarURI,
            }
        });
    }
    async addWin(id) {
        return this.prisma.prismaClient.stats.update({
            where: { id },
            data: {
                wins: {
                    increment: 1,
                },
            },
        });
    }
    async addLoss(id) {
        return this.prisma.prismaClient.stats.update({
            where: { id },
            data: {
                losses: {
                    increment: 1,
                },
            },
        });
    }
    async createFriendShip(user1_id, user2_id) {
        return this.prisma.prismaClient.friendships.create({
            data: {
                user1_id: user1_id,
                user2_id: user2_id
            }
        });
    }
    async deleteFriendship(friendship_id) {
        return this.prisma.prismaClient.friendships.delete({
            where: {
                id: friendship_id
            }
        });
    }
    async deleteUserAccount(user_id) {
        return this.prisma.prismaClient.user.delete({
            where: {
                id: user_id,
            },
        });
    }
    async changeVisibily(user_id, status) {
        this.prisma.prismaClient.user.update({
            where: {
                id: user_id,
            },
            data: {
                status: status,
            }
        });
    }
};
exports.UserCrudService = UserCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserCrudService);
//# sourceMappingURL=user-crud.service.js.map