import { Injectable } from "@nestjs/common";
import { MessageDto} from '../../dto/chat.dto';
import { ChatCrudService } from "src/prisma/chat-crud.service";
import { UserCrudService } from "src/prisma/user-crud.service";



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



   async storeMessageInDb (message : MessageDto)
   {
      return await this.chatCrudService.createMessage (message);
   }


}

