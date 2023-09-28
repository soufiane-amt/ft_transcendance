import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GameCrudService } from 'src/prisma/game-crud.service';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('api')
export class DashboardController {
    constructor(private readonly user : UserCrudService, private readonly resultgame : GameCrudService, private readonly authservice: AuthService, private readonly service: PrismaService) {}
    @Get('Dashboard')
    @UseGuards(JwtAuthGuard)
    async HandleProfilepic(@Req() request, @Res() response: any) {
      const authorizationHeader = request.headers.authorization;
      if (!authorizationHeader) {
        return response.status(401).send({ error: 'Authorization header is missing' });
      }
      const tokenParts = authorizationHeader.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return response.status(401).send({ error: 'Invalid authorization header format' });
      }

      const JwtToken: string = tokenParts[1];
    
      const payload: any = this.authservice.extractPayload(JwtToken);
      const user = await this.service.prismaClient.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      return response.status(200).send(user);
    }

  @Get('Dashboard/allUsers')
  @UseGuards(JwtAuthGuard)
  async sendAllfriend(@Req() request, @Res() response: any)
  {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response.status(401).send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response.status(401).send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const users: any[] = await this.user.findAllUsersdata(payload.userId);
      return response.status(200).send(users);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }

  }
  

  @Get('Dashboard/friends')
  @UseGuards(JwtAuthGuard)
  async sendUser(@Req() request, @Res() response: any)
  {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response.status(401).send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response.status(401).send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const usersId: any[] = await this.user.findFriendsList(payload.userId);
      const users: any[] = [];
    
      await Promise.all(
        usersId.map(async (user) => {
          if (user.user1_id === payload.userId)
          {
            const userData = await this.user.findUserByID(user.user2_id);
            users.push(userData);
          }
          else if (user.user2_id === payload.userId)
          {
              const userData = await this.user.findUserByID(user.user1_id);
              users.push(userData);
          }
        })
      );
      return response.status(200).send(users);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/friends/result')
  @UseGuards(JwtAuthGuard)
  async result(@Req() request, @Res() response: any)
  {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response.status(401).send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response.status(401).send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const users: any[] = await this.user.userMatchsRecord(payload.userId);
      return response.status(200).send(users);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/game')
  @UseGuards(JwtAuthGuard)
  async game(@Req() request, @Res() response: any)
  {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response.status(401).send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response.status(401).send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];
    const payload: any = this.authservice.extractPayload(JwtToken);
    const user = await this.user.getUserStats(payload.userId);
    return response.status(200).send(user);
  }

  // @Post('Dashboard/addfriend')
  // addfriends(@Body() data: any)
  // {
  //     console.log('Receive data', data);
  //     return data;
  // }

  @Get('Dashboard/statistic')
  @UseGuards(JwtAuthGuard)
  async sendStatistic(@Req() request, @Res() response: any)
  {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response.status(401).send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response.status(401).send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const statistic: any[] = await this.resultgame.retreiveGamesScoreForStatistic(payload.userId);
      return response.status(200).send(statistic);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Post('Dashboard/logout')
  @UseGuards(JwtAuthGuard)
  async Section(@Req() request, @Res() response: any)
  {
    if (request)
    {
      const authorizationHeader = request.headers.authorization;
      if (!authorizationHeader) {
        return response.status(401).send({ error: 'Authorization header is missing' });
      }
      const tokenParts = authorizationHeader.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return response.status(401).send({ error: 'Invalid authorization header format' });
      }
    // 
      const JwtToken: string = tokenParts[1];
    // 
      const payload: any = this.authservice.extractPayload(JwtToken);
      this.user.changeVisibily(payload.userId, "OFFLINE");
    }
  }
}
