import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-aut.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly service: PrismaService,
  ) {}

  @Get('login')
  @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {}

  @Get('redirect')
  @UseGuards(FortytwoOauthGuard)
  async HandleRedirect(@Req() request, @Res() response: Response) {
    const token = await this.authservice.signIn(request.user);

    response.cookie('access_token', token, {
      maxAge: 86400000,
      secure: false,
    });

    const user = await this.service.user.findUnique({
      where: {
        email: request.user.email,
      },
    });

    // here i will redirect the user to the profile page
    if (user.firstauth) {
      // here I will redirect the user to change the data
      await this.service.user.update({
        where: {
          email: request.user.email,
        },
        data: {
          firstauth: false,
        },
      });
      return response.redirect(`${process.env.FRONT_SERV}/updatecredentials`);
    } else
      return response.redirect(`${process.env.FRONT_SERV}/updatecredentials`);

    // return response.redirect('http://localhost:3001/profile');
    // return response.status(200).send('done');
  }

  @Post('updatecredentials')
  @UseGuards(JwtAuthGuard)
  HandleChangeDataFirstLogin(@Req() request, @Res() response: Response){
    const data = request.body.data;
    console.log(data);

    return response.status(200).send();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async HandleProfilepic(@Req() request, @Res() response: Response) {
    const JwtToken : string  = request.headers.authorization.split(' ')[1];

    const payload : any =  this.authservice.extractPayload(JwtToken);
    const user = await this.service.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    return response.status(200).send(user);
  }
}
