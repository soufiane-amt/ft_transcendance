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
import { JwtAuthGuard } from './guards/jwt-aut.guard';

@Controller()
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Get('login')
  @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {}

  @Get('redirect')
  @UseGuards(FortytwoOauthGuard)
  async HandleRedirect(@Req() request, @Res() response: Response) {
    const token = await this.authservice.signIn(request.user);

    response.cookie('access_token', token, {
      maxAge: 60 * 60 * 24 * 7,
      secure: false,
    });

    return response.redirect('http://localhost:3001/profile');
    // return response.status(200).send('done');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async HandleProfile() {
    return 'profile';
  }
}
