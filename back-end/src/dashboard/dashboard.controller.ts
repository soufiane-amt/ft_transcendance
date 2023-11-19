import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GameCrudService } from 'src/prisma/game-crud.service';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { response } from 'express';

@Controller('api')
export class DashboardController {
  constructor(
    private readonly user: UserCrudService,
    private readonly resultgame: GameCrudService,
    private readonly authservice: AuthService,
    private readonly service: PrismaService,
  ) {}
  @Get('Dashboard')
  @UseGuards(JwtAuthGuard)
  async HandleProfilepic(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
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

  @Get('profile/:username')
  async getProfile(@Param('username') username: string, @Res() response: any) {
    let alldata: any = {};
    const user_id = await this.user.findUserByUsername(username);
    if (user_id) {
      const user = await this.user.findUserByID(user_id);
      const achiv = await this.user.getUserStats(user_id);
      alldata = { ...user, ...achiv };
      return response.status(200).send(alldata);
    } else {
      return response.status(400);
    }
  }

  @Get('profile/statistic/:username')
  async getProfileStatistic(@Param('username') username: string, @Res() response: any) {
    let alldata: any = {};
    const user_id = await this.user.findUserByUsername(username);
    if (user_id) {
      const statistic: any[] =
        await this.resultgame.retreiveGamesScoreForStatistic(user_id);
      return response.status(200).send(statistic);
    } else return response.status(400).json({ error: 'Bad Request: Your custom error message' });
;
  }

  @Get('Dashboard/allUsers')
  @UseGuards(JwtAuthGuard)
  async sendAllfriend(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const users: any[] = await this.user.findNonFriendsUsers(payload.userId);
      const newusers = await Promise.all(
        users.map(async (user) => {
          const isFriendRequestSent =
            await this.user.FriendShipRequestAlreadySent(
              payload.userId,
              user.id,
            );
          if (isFriendRequestSent) user.pending = true;
          return user;
        }),
      );
      return response.status(200).send(newusers);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/friends')
  @UseGuards(JwtAuthGuard)
  async sendUser(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const usersId: any[] = await this.user.findFriendsList(payload.userId);
      // console.log("users ID : ", usersId);
      const users: any[] = [];

      await Promise.all(
        usersId.map(async (user) => {
          const userData = await this.user.findUserByID(user);
          users.push(userData);
        }),
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
  async result(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const users: any[] = await this.resultgame.retreiveGamesScoreForStatistic(
        payload.userId,
      );
      return response.status(200).send(users);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/game')
  @UseGuards(JwtAuthGuard)
  async game(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];
    const payload: any = this.authservice.extractPayload(JwtToken);
    const user = await this.user.getUserStats(payload.userId);
    return response.status(200).send(user);
  }

  @Get('Dashboard/statistic')
  @UseGuards(JwtAuthGuard)
  async sendStatistic(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const statistic: any[] =
        await this.resultgame.retreiveGamesScoreForStatistic(payload.userId);
      return response.status(200).send(statistic);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/notification')
  @UseGuards(JwtAuthGuard)
  async sendnotification(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const notificationtable =
        await this.user.getUserNotificationsWithUser2Data(payload.userId);
      return response.status(200).send(notificationtable);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get('Dashboard/RankUsers')
  @UseGuards(JwtAuthGuard)
  async RankUsers(@Req() request, @Res() response: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return response
        .status(401)
        .send({ error: 'Authorization header is missing' });
    }
    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return response
        .status(401)
        .send({ error: 'Invalid authorization header format' });
    }

    const JwtToken: string = tokenParts[1];

    try {
      const payload: any = this.authservice.extractPayload(JwtToken);
      const Users = await this.user.findAllUsers(payload.userId);
      const levelsFriends: any[] = [];
      await Promise.all(
        Users.map(async (user) => {
          const Data = await this.user.getUserStats(user.id);
          levelsFriends.push(Data);
        }),
      );
      return response.status(200).send(levelsFriends);
    } catch (error) {
      // Handle any errors that occur during the process
      // console.error('Error:', error);
      return response.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
