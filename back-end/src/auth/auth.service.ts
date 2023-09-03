import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly service: PrismaService) {}

  // signin function
  async signIn(user) {
    if (!user) throw new BadRequestException('Unauthenticated');

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) return this.registerUser(user);
    return 'user connected successfully';
  }

  // function to register user
  async registerUser(user) {
    try {
      const createUser = await this.service.user.create({
        data: user,
      });

      return 'user registred successfully';
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // function to find user by email on database
  async findUserByEmail(_email) {
    const user = await this.service.user.findUnique({
      where: {
        email: _email,
      },
    });
    if (!user) return null;
    return user;
  }
}
