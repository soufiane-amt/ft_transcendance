import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Fortytwostrategy } from './strategies/Fortytwo-Oauth.strategy';


@Module({
  providers: [AuthService, Fortytwostrategy],
  controllers: [AuthController]
})
export class AuthModule {}
