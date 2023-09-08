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
      const newUser = await this.service.user.create({
        data: user,
      });

      return this.signToken(newUser.id, newUser.email);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // function to find user by email on database
  async findUserByEmail(_email: string) {
    const user = await this.service.user.findUnique({
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
    const token = await this.jwtservice.signAsync(payload);
    return token;
  }
}
