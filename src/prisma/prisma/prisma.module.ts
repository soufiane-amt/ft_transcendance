import { Module } from '@nestjs/common';
import { ChatCrudService } from './chat-crud.service';
import { PrismaService } from './prisma.service';
import { UserCrudService } from './user-crud.service';
import { GameCrudService } from './game-crud.service';

@Module({
  providers: [PrismaService, ChatCrudService, UserCrudService, GameCrudService]
})
export class PrismaModule {}
