import { CanActivate, ExecutionContext, HttpStatus, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { GameService } from '../game.service';
import { JwtPayload } from 'src/auth/strategies/Jwt.strategy';

@Injectable()
export class GatewaysGuard implements CanActivate {
  constructor(gameService: GameService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws')
      return true;
    const client: Socket = context.switchToWs().getClient();
    try {
      GatewaysGuard.validateJwt(client);
      return true;
    } catch {
      throw new WsException({ message:'unauthorized client', status: HttpStatus.UNAUTHORIZED  });
    }
  }

  static validateJwt(client: Socket): string {
    const token: string = client.handshake.headers.authorization;
    const payload: any = verify(token, process.env.JWT_SECRET);
    return payload.userId;
  }
}
