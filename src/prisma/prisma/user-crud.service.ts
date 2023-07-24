import { Inject, Injectable } from '@nestjs/common';
import {  PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {userDto } from '../../chat/dto/user.dto'

@Injectable()
export class UserCrudService 
{
    constructor (@Inject (PrismaService) private readonly prisma:PrismaClient ){}

      // Create:
// Create a new user account upon registration.
// @catchError
async createUserAccount(data: userDto)
{
    return this.prisma.user.create ({data})
}


//   Read:
// @catchError
//ifindUser method finds user by id 
async findUserByID(userId: string)
{
  return this.prisma.user.findUnique (
    {
      where : {
        id : userId
      }
    }
  )
}
// @catchError
//ifindUser method finds user by username 
async findUserByUsername(username: string)
{
  return this.prisma.user.findUnique (
    {
      where : {
        username : username
      }
    }
  )
}

// Retrieve user's friends list and their statuses.
// @catchError
async findFriendsList(id: string)
{
  return this.prisma.friendships.findMany (
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
// @catchError
// Retrieve user stats (wins, losses, ladder level, achievements, etc.).
async getUserStats (user_id:string)
{
    return this.prisma.stats.findUnique(
    {
      where:{
        user_id: user_id,
      }
    }
  )
}

// Retrieve user's match history.
// @catchError
async userMatchsRecord(user_id : string)
{
    return this.prisma.match.findMany(
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
// @catchError
// Update:
// Update user information (avatar, two-factor authentication settings, etc.).
async changeUserAvatar (user_id: string, newAvatarURI :string)
{
    return this.prisma.user.update(
    {
      where: { id : user_id}, 
      data : {
        avatar: newAvatarURI,
      }
    }
    )
  } 
//other setting may be added later ... //***// */
// @catchError
async addWin (id : string)
{
    // Use the 'increment' method to increment the numeric field
     return this.prisma.stats.update({
      where: { id },
      data: {
        wins: {
          increment: 1,
        },
      },
    });
  }

//   @catchError
async addLoss (id : string)
{
    // Use the 'increment' method to increment the numeric field
    return this.prisma.stats.update({
      where: { id },
      data: {
        losses: {
          increment: 1,
        },
      },
    });
}

  //friendShips
// @catchError
async createFriendShip (user1_id :string, user2_id :string)
{
  return this.prisma.friendships.create (
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
  return this.prisma.friendships.delete({
    where:
    {
      id :friendship_id
    }
  })
}
// @catchError
async deleteUserAccount (user_id:string)
{
  return  this.prisma.user.delete({
    where: {
      id: user_id,
    },
  });
}

// @catchError
async changeVisibily (user_id : string,  status:  'IN_GAME' | 'ONLINE' | 'OFFLINE')
{
  this.prisma.user.update ({
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