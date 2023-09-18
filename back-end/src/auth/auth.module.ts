import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Fortytwostrategy } from './strategies/Fortytwo-Oauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/Jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOOKEN_EXP },
    }),
  ],
  providers: [AuthService, Fortytwostrategy, JwtStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
