import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { userDto } from 'src/chat/dto/user.dto';
import { NotificationType, Status } from '@prisma/client';

interface notificationType {

  user1_id : string;

  user2_id : string;

  notificationType : NotificationType;
}

@Injectable()
export class UserCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}

//   Read:
//ifindUser method finds user by id 
async findUserAvatar(userId: string)
{
  return await this.prisma.prismaClient.user.findUnique (
    {
      where : {
        id : userId
      },
      select: {
        avatar:true,
      }

    }
  )
}

async findUserSessionDataByID(userId: string)
{
  return await this.prisma.prismaClient.user.findUnique (
    {
      where : {
        id : userId
      },
      select: {
        id:true,
        username:true,
        avatar:true,

      }
    }
  )
}



async findFriendsUsernameAvatar(user_id: string)
{
  const friends_ids = await this.findFriendsList(user_id)
  const friends = await this.prisma.prismaClient.user.findMany({
    where: {
      id: {
        in: friends_ids,
      },
    },
    select:{
      username:true, 
      avatar:true,

    }
  });
  return friends;
}


async findFriendship(current_user_id: string, targeted_user_id: string)
{
  const friendship = await this.prisma.prismaClient.friendships.findFirst (
    {
      where : {
        OR: [
          { user1_id: current_user_id, user2_id: targeted_user_id },
          { user1_id: targeted_user_id, user2_id: current_user_id },
        ],
        },
      select :
      {
        id :true
      }
    }
  )
  return friendship ? friendship.id : null 
}




  async findAllUsersdata(userID: string) {
    const usersID: any[] = await this.findAllUsers(userID);

    const users: any[] = [];

    await Promise.all(
      usersID.map(async (user) => {
        const userData = await this.findUserByID(user.id);
        users.push(userData);
      }),
    );
    return users;
  }

  async findNonFriendsUsers(userId: string) {
    const friendships = await this.prisma.prismaClient.friendships.findMany({
      where: {
        OR: [
          {
            user1_id: userId,
          },
          {
            user2_id: userId,
          },
        ],
      },
    });

    // Extract friend IDs from the friendships
    const friendIdsArray = friendships.map((friendship) =>
      userId === friendship.user1_id
        ? friendship.user2_id
        : friendship.user1_id,
    );

    const nonFriendsUsers = await this.prisma.prismaClient.user.findMany({
      where: {
        NOT: {
          id: {
            in: friendIdsArray,
          },
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });
    const filteredNonFriendsUsers = nonFriendsUsers.filter(
      (user) => user.id !== userId,
    );

    return filteredNonFriendsUsers;
  }

  async FriendShipRequestAlreadySent(
    current_user_id: string,
    targeted_user_id: string,
  ) {
    return (
      (await this.prisma.prismaClient.notification.count({
        where: {
          user1_id: targeted_user_id,
          user2_id: current_user_id,
          type: 'FRIENDSHIP_REQUEST',
        },
      })) != 0
    );
  }

  async changeUserBackgroundImg(user_id: string, newBackImg: string) {
    return this.prisma.prismaClient.user.update({
      where: { id: user_id },
      data: {
        background: newBackImg,
      },
    });
  }

  async findAllUsers(excludedUserid: string) {
    const users = await this.prisma.prismaClient.user.findMany({
      where: {
        NOT: {
          id: excludedUserid,
        },
      },
    });
    return users;
  }

  async createNotification(
    user1_id: string,
    user2_id: string,
    notificationType: NotificationType,
  ) {
    await this.prisma.prismaClient.notification.create({
      data: {
        user1_id: user1_id,
        user2_id: user2_id,
        type: notificationType,
      },
    });
  }

  async getUserNotificationsWithUser2Data(userId: string) {
    const notifications = await this.prisma.prismaClient.notification.findMany({
      where: {
        user1_id: userId,
      },
      include: {
        user2: true, // Include user2 data
      },
    });
    const notificationsWithUser2Data = notifications.map((notification) => {
      const user2Data = notification.user2;

      return {
        id_notif: notification.id,
        id: notification.user2.id,
        user2Username: user2Data.username,
        user2Avatar: user2Data.avatar,
        type: notification.type,
        createdAt: notification.createdAt,
      };
    });

    return notificationsWithUser2Data;
}

  //   Read:
  //ifindUser method finds user by id
  async findUserByID(userId: string) {
    return await this.prisma.prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  //ifindUser method finds user by username
  async findUserByUsername(username: string) {
    const user = await this.prisma.prismaClient.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
    return user ? user.id : null;
  }

  // Retrieve user's friends list and their statuses.
  async findFriendsList(id: string) {
    const friendShips = await this.prisma.prismaClient.friendships.findMany({
      where: {
        OR: [{ user1_id: id }, { user2_id: id }],
      },
      select: {
        user1_id: true,
        user2_id: true,
      },
    });

    const friends_ids = friendShips.map((friendship) => {
      // Determine the friend's ID based on the current user's ID
      return id === friendship.user1_id
        ? friendship.user2_id
        : friendship.user1_id;
    });

    return friends_ids;
  }

  // Retrieve user stats (wins, losses, ladder level, achievements, etc.).
  async getUserStats(user_id: string) {
    return this.prisma.prismaClient.stats.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  // Retrieve user's match history.
  async userMatchsRecord(user_id: string) {
    return this.prisma.prismaClient.game.findMany({
      where: {
        OR: [{ player1_id: user_id }, { player2_id: user_id }],
      },
    });
  }
  // Update:
  // Update user information (avatar, two-factor authentication settings, etc.).
  async changeUserAvatar(user_id: string, newAvatarURI: string) {
    return this.prisma.prismaClient.user.update({
      where: { id: user_id },
      data: {
        avatar: newAvatarURI,
      },
    });
  }
  //other setting may be added later ... //***// */

  //friendShips
  async createFriendShip(user1_id: string, user2_id: string) {
    return this.prisma.prismaClient.friendships.create({
      data: {
        user1_id: user1_id,
        user2_id: user2_id,
      },
    });
  }

  //in case the user
  async deleteFriendship(friendship_id: string) {
    return this.prisma.prismaClient.friendships.delete({
      where: {
        id: friendship_id,
      },
    });
  }
  async deleteUserAccount(user_id: string) {
    return this.prisma.prismaClient.user.delete({
      where: {
        id: user_id,
      },
    });
  }

  async changeVisibily(
    user_id: string,
    status: 'IN_GAME' | 'ONLINE' | 'OFFLINE',
  ) {
    await this.prisma.prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        status: status,
      },
    });
  }

  async getUserStatus(id: string): Promise<Status> {
    const { status } = await this.prisma.prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    });
    return status;
  }
}
