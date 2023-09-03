import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Fortytwostrategy } from './strategies/Fortytwo-Oauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, Fortytwostrategy, JwtStrategy, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
