import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { GameService } from './game.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GatewaysGuard } from './guards/gateways.guard';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GameGateway, GameService,
    {
      provide: APP_GUARD,
      useClass: GatewaysGuard
    },
],
exports: [GameService]
})
export class GameModule {}
