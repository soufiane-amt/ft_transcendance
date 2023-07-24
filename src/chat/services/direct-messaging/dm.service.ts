import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from '../../dto/create-chat.dto';


@Injectable()
export class DmService
{
   create (createMessageDto: CreateMessageDto)
   {
    console.log ("The message is been saved in database.")
   }
}