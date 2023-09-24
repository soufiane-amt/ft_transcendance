import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly service: PrismaService,
    private readonly jwtservice: JwtService,
  ) {}

  // signin function
  async signIn(user) {
    if (!user) throw new BadRequestException('Unauthenticated');

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) return this.registerUser(user);
    return this.signToken(userExists.id, userExists.email);
  }

  // function to register user
  async registerUser(user) {
    try {
      const newUser = await this.service.prismaClient.user.create({
        data: { ...user, firstauth: true, background: '' , twoFactorAuthenticationSecret: ''},
      });

      return this.signToken(newUser.id, newUser.email);
    } catch (error) {
      console.log('\nerror\n', error);
      throw new InternalServerErrorException();
    }
  }

  // function to find user by email on database
  async findUserByEmail(_email: string) {
    const user = await this.service.prismaClient.user.findUnique({
      where: {
        email: _email,
      },
    });
    if (!user) return null;
    return user;
  }

  async signToken(userId: string, email: string) {
    const payload = {
      userId: userId,
      email: email,
    };

    try {
      const token = await this.jwtservice.signAsync(payload);
      return token;
    } catch (error) {
      console.log(error);
    }
  }


  async TwoFaToken(email: string) {
    const payload = {
      email: email,
    };
    
    try {
      const token = await this.jwtservice.signAsync(payload);
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  extractPayload(token: string) {
    const payload = this.jwtservice.decode(token);
    return payload;
  }
}
