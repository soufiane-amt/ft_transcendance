import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from '../../dto/create-chat.dto';
import { ChatCrudService } from 'src/prisma/prisma/chat-crud.service';
import { UserCrudService } from 'src/prisma/prisma/user-crud.service';


@Injectable()
export class DmService
{
   constructor (private readonly chatCrudService:ChatCrudService, private readonly userCrudService:UserCrudService){}


   async checkFriendshipExistence (username1:string, username2:string)
   {
      try
      {
         const user1_id = await this.userCrudService.findUserByUsername(username1)
   
         const user2_id = await this.userCrudService.findUserByUsername(username2)

         await this.userCrudService.findFriendship (user1_id, user2_id)

         return { user1_id : user1_id, user2_id : user2_id}

      }
      catch (error)
      {
         return (null)
      }
      return (null)
   }

   async checkDmTableExistence (user1_id:string, user2_id:string)
   {
      try
      {

         await this.userCrudService.findFriendship (user1_id, user2_id)

         return { user1_id : user1_id, user2_id : user2_id}

      }
      catch (error)
      {
         return (null)
      }
      return (null)
   }

}

