import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { testDto } from './chat/dto/test.dto';
import { matchDto } from './chat/dto/match.dto';
import { GameCrudService } from './prisma/prisma/game-crud.service';
import { UserCrudService } from './prisma/prisma/user-crud.service';
import { WebSocketGatewayClass } from './Dashboard/dashboard/WebSocketGatewayClass';

@Controller('nest')
export class AppController {
  
}
