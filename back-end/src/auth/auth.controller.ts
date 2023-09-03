import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';
import { AuthService } from './auth.service';

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
  async HandleRedirect(@Req() request) {
    return await this.authservice.signIn(request.user);
  }
}
