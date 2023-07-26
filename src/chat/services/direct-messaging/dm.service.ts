import { Injectable } from "@nestjs/common";
import { CreateMessageDto, dmDto } from '../../dto/create-chat.dto';
import { ChatCrudService } from 'src/prisma/prisma/chat-crud.service';
import { UserCrudService } from 'src/prisma/prisma/user-crud.service';


@Injectable()
export class DmService
{
   constructor (private readonly chatCrudService:ChatCrudService, private readonly userCrudService:UserCrudService){}


   async checkFriendshipExistence (user1_id :string, user2_id :string)
   {
      try
      {
         return await this.userCrudService.findFriendship (user1_id, user2_id)
      }
      catch (error)
      {
         return (null)
      }
      return (null)
   }

   async checkDmTableExistence (user1_id:string, user2_id:string)
   {
      try{
         return await this.chatCrudService.getDmTable (user1_id, user2_id)
      }
      catch {
         return null;
      }
   }

   async createDmTable (user1_id:string, user2_id:string) 
   {
      return await this.chatCrudService.createDm ({user1_id,user2_id, status :'ALLOWED'})
   }

   // async getAllUserDms (user_id :string)
   // {
   //    return this.chatCrudService.retrieveUserDmChannels (user_id)
   // }

   async getAllDmMessages (dm_id :string)
   {
      try{
         return await this.chatCrudService.retrieveChannelMessages(dm_id)
      }
      catch {
         return {};
      }
   }

   async getAllDmRooms (user_id :string)
   {
      try{
         return await this.chatCrudService.retrieveUserDmChannels(user_id)
      }
      catch {
         return {};
      }
   }

   async storeMessageInDb (message : CreateMessageDto)
   {
      return await this.chatCrudService.createMessage (message);
   }
}

