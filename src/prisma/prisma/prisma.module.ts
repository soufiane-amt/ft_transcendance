import { Module } from '@nestjs/common';
import { ChatCrudService } from './chat-crud.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, ChatCrudService]
})
export class PrismaModule {}
