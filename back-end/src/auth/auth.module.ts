import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Fortytwostrategy } from './strategies/Fortytwo-Oauth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [AuthService, Fortytwostrategy],
  controllers: [AuthController],
})
export class AuthModule {}
