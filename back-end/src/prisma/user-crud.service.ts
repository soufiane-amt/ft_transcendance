import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { userDto } from 'src/chat/dto/user.dto';
import { NotificationType } from '@prisma/client';


@Injectable()
export class UserCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}

    async findAllUsersdata(userID: string)
{
  const usersID: any[] = await this.findAllUsers(userID);
  
      const users: any[] = [];
    
      await Promise.all(
        usersID.map(async (user) => {
          const userData = await this.findUserByID(user.id);
          users.push(userData);
        })
      );
      return users;
}

async changeUserBackgroundImg (user_id: string, newBackImg :string)
  {
      return this.prisma.prismaClient.user.update(
      {
        where: { id : user_id}, 
        data : {
          background: newBackImg,
        }
      }
      )
}

async findAllUsers(excludedUserid: string)
{
  const users = await this.prisma.prismaClient.user.findMany (
    {
    where: {
        NOT: {
            id: excludedUserid,
        }
    },
  });
  return users;
}

async createNotification(user1_id :string, user2_id :string, notificationType:NotificationType) {
  await this.prisma.prismaClient.notification.create({
    data: {
      user1_id: user1_id ,
      user2_id: user2_id ,
      type: notificationType,
    },
  });
}

async  getUserNotificationsWithUser2Data(userId: string) {
  const notifications = await this.prisma.prismaClient.notification.findMany({
    where: {
        user1_id: userId ,
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
async findUserByID(userId: string)
{
  return await this.prisma.prismaClient.user.findUnique (
    {
      where : {
        id : userId
      }
    }
  )
}

//ifindUser method finds user by username 
async findUserByUsername(username: string) 
{
    const user =  await this.prisma.prismaClient.user.findUnique (
    {
      where : {
        username : username
      },
      select :
      {
        id : true
      }
    }
  )
  return user ? user.id : null
}

// Retrieve user's friends list and their statuses.
async findFriendsList(id: string)
{
  return this.prisma.prismaClient.friendships.findMany (
    {
      where : {
        OR : [
          {user1_id: id},
          {user2_id : id},
        ]
      }
    }
  )
}

async findFriendship(user1_id: string, user2_id: string)
{
  const friendship = await this.prisma.prismaClient.friendships.findUnique (
    {
      where : {
          user1_id: user1_id,
          user2_id : user2_id
      },
      select :
      {
        id :true
      }
    }
  )
  return friendship ? friendship.id : null 
}


// Retrieve user stats (wins, losses, ladder level, achievements, etc.).
async getUserStats (user_id:string)
{
    return this.prisma.prismaClient.stats.findUnique(
    {
      where:{
        user_id: user_id,
      }
    }
  )
}

// Retrieve user's match history.
async userMatchsRecord(user_id : string)
{
    return this.prisma.prismaClient.match.findMany(
    {
      where: {
        OR : [
          {player_1_id: user_id},
          {player_2_id : user_id},
        ],
      }
    }
  )
}
// Update:
// Update user information (avatar, two-factor authentication settings, etc.).
async changeUserAvatar (user_id: string, newAvatarURI :string)
{
    return this.prisma.prismaClient.user.update(
    {
      where: { id : user_id}, 
      data : {
        avatar: newAvatarURI,
      }
    }
    )
  } 
//other setting may be added later ... //***// */
async addWin (id : string)
{
    // Use the 'increment' method to increment the numeric field
     return this.prisma.prismaClient.stats.update({
      where: { id },
      data: {
        wins: {
          increment: 1,
        },
      },
    });
  }

async addLoss (id : string)
{
    // Use the 'increment' method to increment the numeric field
    return this.prisma.prismaClient.stats.update({
      where: { id },
      data: {
        losses: {
          increment: 1,
        },
      },
    });
}

  //friendShips
async createFriendShip (user1_id :string, user2_id :string)
{
  return this.prisma.prismaClient.friendships.create (
    {
      data:
      {
        user1_id: user1_id,
        user2_id: user2_id
      }
    }
  )
}

//in case the user 
async deleteFriendship (friendship_id :string)
{
  return this.prisma.prismaClient.friendships.delete({
    where:
    {
      id :friendship_id
    }
  })
}
async deleteUserAccount (user_id:string)
{
  return  this.prisma.prismaClient.user.delete({
    where: {
      id: user_id,
    },
  });
}

async changeVisibily (user_id : string,  status:  'IN_GAME' | 'ONLINE' | 'OFFLINE')
{
  await this.prisma.prismaClient.user.update ({
    where:
    {
      id : user_id,
    },
    data:
    {
      status :status,
    }
  })
}
//this function will remain commented untill I figure out what should it does exactly
// async incrementLadderLevel ()
// {

// }

}