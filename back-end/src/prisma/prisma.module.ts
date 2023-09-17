import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ChatCrudService } from './chat-crud.service';
import { UserCrudService } from './user-crud.service';
import { GameCrudService } from './game-crud.service';

@Global()
@Module({
  providers: [PrismaService, ChatCrudService, UserCrudService, GameCrudService],
  exports: [PrismaService, ChatCrudService, UserCrudService, GameCrudService]
})
export class PrismaModule {}
