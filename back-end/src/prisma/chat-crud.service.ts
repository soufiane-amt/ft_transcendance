import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MessageDto, channelDto, channelMembershipDto, dmDto } from 'src/chat/dto/chat.dto';


@Injectable()
export class ChatCrudService 
{
  constructor (@Inject (PrismaService) private readonly prisma:PrismaService ){}


    async retrieveUserContactBook (user_id :string) 
    { 
      const partnersIds = await this.prisma.prismaClient.directMessaging.findMany({
        where: {
            OR: [
                { user1_id: user_id },
                { user2_id: user_id },
            ],
        },
        orderBy: {
            updatedAt: 'asc',
        },
        select: {
            user1_id: true,
            user2_id: true,
        },
    });
    //Promise.all waits for all map operations to end 
      const partnerContactData =   Promise.all( partnersIds.map( async (dm_item) => {
        //This next check which id belong to the parntner of the actual user
        const partner_id = user_id == dm_item.user1_id ? dm_item.user2_id : dm_item.user1_id;
        const partnerData =  await this.prisma.prismaClient.user.findUnique ({
                where : {
                  id : partner_id
                },
                select : {
                  username :true,
                  avatar :true
                }})
        return { id: partner_id, username: partnerData.username, avatar : partnerData.avatar};
      })); 
      return (partnerContactData);
    }


    async retrieveUserDmChannels(user_id :string) {
      return await this.prisma.prismaClient.directMessaging.findMany({
          where: {
              OR: [
                  { user1_id: user_id },
                  { user2_id: user_id },
              ]
          },
          orderBy: {
              updatedAt: 'asc'
          },
          select: {
              id: true,
              user1_id: true,
              user2_id: true,
          }
      });
  }
  async retreiveDmInitPanelData(user_id) {
      const dmUsersIds = await this.prisma.prismaClient.directMessaging.findMany({
          where: {
              OR: [
                  { user1_id: user_id },
                  { user2_id: user_id },
              ],
          },
          orderBy: {
              updatedAt: 'asc',
          },
          select: {
              id: true,
              user1_id: true,
              user2_id: true,
              messages: {
                  select: {
                      id: true,
                      content: true,
                      createdAt: true,
                      is_read: true,
                  },
                  orderBy: {
                      createdAt: 'desc',
                  },
                  take: 1,
              },
          },
      });
      return dmUsersIds.map((dm_item) => {
          const partner = user_id == dm_item.user1_id ? dm_item.user2_id : dm_item.user1_id;
          return { id: dm_item.id, partner_id: partner, last_message: dm_item.messages[0] };
      });
  }

      // Create a new chat channel (public, or password-protected).

    async   createChannel (user_id:string , data : channelDto)
    {
      const channel_id :string =   (await this.prisma.prismaClient.channel.create ({data})).id
      const memberShipData : channelMembershipDto = {
        channel_id : channel_id,
        user_id : user_id, 
        role : 'OWNER'
      }
      try{

        await this.joinChannel (memberShipData)
      }
      catch (error){
      }
      return channel_id
    }
    
  //user joins channel

    async   joinChannel (data : channelMembershipDto)
    {
        return await this.prisma.prismaClient.channelMembership.create ({data})
    }

    async findChannelById (channel_id :string)
    {
      return await this.prisma.prismaClient.channel.findUnique (
        {
          where :{
            id : channel_id
          }
        }
      )
    }

    async findDmById (dm_id :string)
    {
      try
      {
        return await this.prisma.prismaClient.directMessaging.findUnique (
          {
            where :{
              id : dm_id
            }
          }
        )
      }
      catch
      {
        return null
      }
    }

    async findChannelsByType (channel_type :'PUBLIC' | 'PRIVATE' | 'PROTECTED')
    {
      return this.prisma.prismaClient.channel.findMany (
        {
          where :{
            type : channel_type
          }
        }
      )
    }
    async createDm ( data : dmDto)
    {
      return (await this.prisma.prismaClient.directMessaging.create ({data})).id
    }


    async getDmTable ( user1_id: string, user2_id: string)
    {
        const Dm = await this.prisma.prismaClient.directMessaging.findUnique({
        where :
        {
          user1_id :user1_id,
          user2_id : user2_id
        },
        select : {
          id : true
        }

      })
      return Dm ? (await Dm).id : null
    }


    //this method finds all the channels that exist in the server
    
    
    async findAllChannelsAvailbleToJoin(user_id :string)
    {
      const notJoinedChannels = await this.prisma.prismaClient.channelMembership.findMany(
        {
          where :
          {
            user_id :
            {
              not :user_id
            },
          },
          select :{
            id :true
          }
      });
      //the type of the retrieved id's look like this { id: string }[], the nest function tries to add them to an array of string
      const channelIds: string[] = notJoinedChannels.map(item => item.id);

      return  this.prisma.prismaClient.channel.findMany (
        {
          where :{
            id:
              {
                in: channelIds
              },
            OR:[
              {type: 'PUBLIC'},
              {type :  'PROTECTED'}
            ]
          }
        }
      )
    }


    async findAllJoinedChannels (user_id :string )
    {
      return this.prisma.prismaClient.channelMembership.findMany(
        {
          where :
          {
            user_id : user_id
          },
        }
      );
    }


    async retrieveRoomMessages (room_id : string)//This method is used both for dm and groups
    {
      try{
        return await this.prisma.prismaClient.message.findMany(
        {
          where :
          {
            OR:[
              {channel_id : room_id},
              {dm_id : room_id}
            ]
          },
          orderBy :{
            createdAt : 'asc'
          }
        }
      )
      }
      catch{
        return {}
      }
    }


    // Retrieve direct messages between users.
    async retieveBlockedUsersList (user_id :string)
    {
      return this.prisma.prismaClient.friendships.findMany (
        {
          where:
          {
            
            OR:[
              {user1_id : user_id},
              {user2_id :user_id}
            ],
            relationStatus : 'BLOCK'
          }
        }
      )
    }
    async retieveBlockedChannelUsers (channel_id :string)//for groups only
    {
      return this.prisma.prismaClient.channelMembership.findMany (
        {
          where:
          {
            channel_id :channel_id,
            is_banned :true
          }
        }
      )
    }



    //update

    async changeChannelPhoto (channel_id: string, newAvatarURI :string)
    {
        return await  this.prisma.prismaClient.channel.update(
        {
          where: { id : channel_id}, 
          data : {
            image: newAvatarURI,
          }
        }
        )
      } 

      async changeChannelType (channel_id: string, new_type : 'PUBLIC' | 'PROTECTED' | 'PRIVATE', new_pass :string)
      {
          return await  this.prisma.prismaClient.channel.update(
          {
            where: { id : channel_id}, 
            data : {
              type : new_type,
              password: new_pass,
            }
          }
          )
        } 
        async changeChannelName (channel_id: string, new_name :string)
        {
            return await  this.prisma.prismaClient.channel.update(
            {
              where: { id : channel_id}, 
              data : {
                name : new_name,
              }
            }
            )
          } 
        
    async blockAUserWithinGroup(user_id :string, channel_id: string)
    {
      return this.prisma.prismaClient.channelMembership.update(
        {
          where :
          {
            channel_id_user_id : {
            channel_id : channel_id,
            user_id : user_id
            },
          },
          data:
          {
            is_banned :true,
            banned_at: new Date()
          }
        }
      )
    }

    async unblockAUserWithinGroup(user_id :string, channel_id: string)
    {
      return this.prisma.prismaClient.channelMembership.update(
        {
          where :
          {
            channel_id_user_id : {
            channel_id : channel_id,
            user_id : user_id
            },
          },
          data:
          {
            is_banned :false,
          }
        }
      )
    }

    async blockAUserWithDm(dm_id: string)
    {
      return this.prisma.prismaClient.directMessaging.update(
        {
          where :{
            id : dm_id
          },
          data:
          {
            status : 'BANNED'
          }
        }
      )
    }

    async unblockAUserWithDm(channel_id: string)
    {
      return this.prisma.prismaClient.directMessaging.update(
        {
          where :{
            id : channel_id
          },
          data:
          {
            status : 'ALLOWED'
          }
        }
      )
    }


    async leaveChannel (user_id: string, channel_id :string)
    {
      return this.prisma.prismaClient.channelMembership.delete (
        {
          where :
          {
            channel_id_user_id : {
            channel_id : channel_id,
            user_id : user_id
            },
          }
        }
      )
    }

    //this method espacially was created in case all the members of a channel left
    async deleteChannel ( channel_id :string)
    {
      try
      {
        await this.prisma.prismaClient.directMessaging.delete (
          {
            where :
            {
              id: channel_id
            }

          }
        )
      }
      catch (error)
      {
        await this.prisma.prismaClient.channel.delete (
          {
            where :
            {
              id: channel_id
            }

          }
        )
      }
    }

    async createMessage (data : MessageDto)
    {
      console.log (data)
      return ( await this.prisma.prismaClient.message.create ({data}))
    }
  
    async deleteMessage (message_id: string)
    {
      this.prisma.prismaClient.message.delete (
        {
          where:
          {
            id : message_id
          }
        }
      )
    }

    async editMessage (message_id: string, content :string)
    {
      this.prisma.prismaClient.message.update ({
        where :
        {
          id : message_id
        },
        data: {
          content : content
        }
      })
    
    }


    async upgradeToAdmin (user_id :string, channel_id: string)
    {
        this.prisma.prismaClient.channelMembership.update ({
          where :
          {
            channel_id_user_id : {
            channel_id : channel_id,
            user_id : user_id
            },
        },
        data: {
          role : 'ADMIN'
        }
      })
    }

    async setGradeToUser (user_id :string, channel_id: string)
    {
      this.prisma.prismaClient.channelMembership.update ({
        where :
        {
          channel_id_user_id : {
          channel_id : channel_id,
          user_id : user_id
          },
        },
        data: {
          role : 'USER'
        }
      })
    }

    async getMemeberShip (user_id :string, channel_id :string)
    {
      return await this.prisma.prismaClient.channelMembership.findUnique ({
        where :
        {
          channel_id_user_id : {
          channel_id : channel_id,
          user_id : user_id
          },
        },
      })
    }

    async makeOwner (user_id :string, channel_id: string)
    {
      this.prisma.prismaClient.channelMembership.update ({
        where :
        {
          channel_id_user_id : {
          channel_id : channel_id,
          user_id : user_id
          },
        },
        data: {
          role : 'OWNER'
        }
      })
    }
      ///

    async checkUserInDm (user_id : string, room_id :string)
    {
      return await this.prisma.prismaClient.directMessaging.findUnique(
        {
          where : 
          {
            OR:[
              {user1_id : user_id},
              {user2_id : user_id},
            ],
            id : room_id
          }
        }
      )
    }
}
