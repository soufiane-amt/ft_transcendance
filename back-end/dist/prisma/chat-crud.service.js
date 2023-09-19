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
exports.ChatCrudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let ChatCrudService = exports.ChatCrudService = class ChatCrudService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChannel(user_id, data) {
        const channel_id = (await this.prisma.prismaClient.channel.create({ data })).id;
        const memberShipData = {
            channel_id: channel_id,
            user_id: user_id,
            role: 'OWNER'
        };
        try {
            await this.joinChannel(memberShipData);
        }
        catch (error) {
        }
        return channel_id;
    }
    async joinChannel(data) {
        return await this.prisma.prismaClient.channelMembership.create({ data });
    }
    async findChannelById(channel_id) {
        return await this.prisma.prismaClient.channel.findUnique({
            where: {
                id: channel_id
            }
        });
    }
    async findDmById(dm_id) {
        try {
            return await this.prisma.prismaClient.directMessaging.findUnique({
                where: {
                    id: dm_id
                }
            });
        }
        catch {
            return null;
        }
    }
    async findChannelsByType(channel_type) {
        return this.prisma.prismaClient.channel.findMany({
            where: {
                type: channel_type
            }
        });
    }
    async createDm(data) {
        return (await this.prisma.prismaClient.directMessaging.create({ data })).id;
    }
    async getDmTable(user1_id, user2_id) {
        const Dm = await this.prisma.prismaClient.directMessaging.findUnique({
            where: {
                user1_id: user1_id,
                user2_id: user2_id
            },
            select: {
                id: true
            }
        });
        return Dm ? (await Dm).id : null;
    }
    async retrieveUserDmChannels(user_id) {
        return this.prisma.prismaClient.directMessaging.findMany({
            where: {
                OR: [
                    { user1_id: user_id },
                    { user2_id: user_id },
                ]
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });
    }
    async findAllChannelsAvailbleToJoin(user_id) {
        const notJoinedChannels = await this.prisma.prismaClient.channelMembership.findMany({
            where: {
                user_id: {
                    not: user_id
                },
            },
            select: {
                id: true
            }
        });
        const channelIds = notJoinedChannels.map(item => item.id);
        return this.prisma.prismaClient.channel.findMany({
            where: {
                id: {
                    in: channelIds
                },
                OR: [
                    { type: 'PUBLIC' },
                    { type: 'PROTECTED' }
                ]
            }
        });
    }
    async findAllJoinedChannels(user_id) {
        return this.prisma.prismaClient.channelMembership.findMany({
            where: {
                user_id: user_id
            },
        });
    }
    async retrieveRoomMessages(room_id) {
        try {
            return await this.prisma.prismaClient.message.findMany({
                where: {
                    OR: [
                        { channel_id: room_id },
                        { dm_id: room_id }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
        }
        catch {
            return {};
        }
    }
    async retieveBlockedUsersList(user_id) {
        return this.prisma.prismaClient.friendships.findMany({
            where: {
                OR: [
                    { user1_id: user_id },
                    { user2_id: user_id }
                ],
                relationStatus: 'BLOCK'
            }
        });
    }
    async retieveBlockedChannelUsers(channel_id) {
        return this.prisma.prismaClient.channelMembership.findMany({
            where: {
                channel_id: channel_id,
                is_banned: true
            }
        });
    }
    async changeChannelPhoto(channel_id, newAvatarURI) {
        return await this.prisma.prismaClient.channel.update({
            where: { id: channel_id },
            data: {
                image: newAvatarURI,
            }
        });
    }
    async changeChannelType(channel_id, new_type, new_pass) {
        return await this.prisma.prismaClient.channel.update({
            where: { id: channel_id },
            data: {
                type: new_type,
                password: new_pass,
            }
        });
    }
    async changeChannelName(channel_id, new_name) {
        return await this.prisma.prismaClient.channel.update({
            where: { id: channel_id },
            data: {
                name: new_name,
            }
        });
    }
    async blockAUserWithinGroup(user_id, channel_id) {
        return this.prisma.prismaClient.channelMembership.update({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
            data: {
                is_banned: true,
                banned_at: new Date()
            }
        });
    }
    async unblockAUserWithinGroup(user_id, channel_id) {
        return this.prisma.prismaClient.channelMembership.update({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
            data: {
                is_banned: false,
            }
        });
    }
    async blockAUserWithDm(dm_id) {
        return this.prisma.prismaClient.directMessaging.update({
            where: {
                id: dm_id
            },
            data: {
                status: 'BANNED'
            }
        });
    }
    async unblockAUserWithDm(channel_id) {
        return this.prisma.prismaClient.directMessaging.update({
            where: {
                id: channel_id
            },
            data: {
                status: 'ALLOWED'
            }
        });
    }
    async leaveChannel(user_id, channel_id) {
        return this.prisma.prismaClient.channelMembership.delete({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            }
        });
    }
    async deleteChannel(channel_id) {
        try {
            await this.prisma.prismaClient.directMessaging.delete({
                where: {
                    id: channel_id
                }
            });
        }
        catch (error) {
            await this.prisma.prismaClient.channel.delete({
                where: {
                    id: channel_id
                }
            });
        }
    }
    async createMessage(data) {
        console.log(data);
        return (await this.prisma.prismaClient.message.create({ data }));
    }
    async deleteMessage(message_id) {
        this.prisma.prismaClient.message.delete({
            where: {
                id: message_id
            }
        });
    }
    async editMessage(message_id, content) {
        this.prisma.prismaClient.message.update({
            where: {
                id: message_id
            },
            data: {
                content: content
            }
        });
    }
    async upgradeToAdmin(user_id, channel_id) {
        this.prisma.prismaClient.channelMembership.update({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
            data: {
                role: 'ADMIN'
            }
        });
    }
    async setGradeToUser(user_id, channel_id) {
        this.prisma.prismaClient.channelMembership.update({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
            data: {
                role: 'USER'
            }
        });
    }
    async getMemeberShip(user_id, channel_id) {
        return await this.prisma.prismaClient.channelMembership.findUnique({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
        });
    }
    async makeOwner(user_id, channel_id) {
        this.prisma.prismaClient.channelMembership.update({
            where: {
                channel_id_user_id: {
                    channel_id: channel_id,
                    user_id: user_id
                },
            },
            data: {
                role: 'OWNER'
            }
        });
    }
    async checkUserInDm(user_id, room_id) {
        return await this.prisma.prismaClient.directMessaging.findUnique({
            where: {
                OR: [
                    { user1_id: user_id },
                    { user2_id: user_id },
                ],
                id: room_id
            }
        });
    }
};
exports.ChatCrudService = ChatCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatCrudService);
//# sourceMappingURL=chat-crud.service.js.map