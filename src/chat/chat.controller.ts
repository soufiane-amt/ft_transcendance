import { Controller, Get } from '@nestjs/common';
import { ChatCrudService } from 'src/prisma/prisma/chat-crud.service';
import { UserCrudService } from 'src/prisma/prisma/user-crud.service';
import { userDto } from './dto/user.dto';


@Controller('chat')
export class ChatController
{
    constructor (private readonly chat :ChatCrudService, private readonly user :UserCrudService)
    {
    
    }
    
    @Get("/direct_messaging")
    async sayYourInChat()
    {
        const user1:userDto = {
          username: "soufciane",
          email : "soudffianeamt@gmail.com",
          password : "012345",
          avatar: "/path/to",
          status : 'IN_GAME'  
        }
        await this.user.createUserAccount(user1 )
        // const user2:userDto = {
        //   username: "hassan",
        //   email : "soufianeamt11@gmail.com",
        //   password : "012345",
        //   avatar: "/path/to",
        //   status : 'IN_GAME'  
        // }
        // this.user.createUserAccount(user2 )

        // const obj = this.chat.createDm( {
        //     user1_id: 'dlskfl343kds',
        //     user2_id : "dfls45jj",
        //     status: "ALLOWED", 
        // })
    }
}
