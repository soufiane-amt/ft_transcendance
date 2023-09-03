import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Get('login')
  @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {
    return 'this is login page';
  }

  @Get('redirect')
  @UseGuards(FortytwoOauthGuard)
  async HandleRedirect(@Req() request, @Res() response: Response) {
    const token = await this.authservice.signIn(request.user);

    response.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return response.status(HttpStatus.OK);
  }
}
