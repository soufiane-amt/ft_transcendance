import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';


@Controller('game')
export class GameController {
    constructor(
        private readonly authservice: AuthService,
        private readonly service: PrismaService,
      ) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async HandleInvitor(@Req() request, @Res() response: Response) {
    const user = await this.service.prismaClient.user.findUnique({
        where: {
          id: request.headers.user,
        },
      });
      return response.status(200).send(user);
  }

}
