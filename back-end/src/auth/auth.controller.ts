import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';

@Controller()
export class AuthController {
  @Get('login')
  @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {
    return 'this is login page';
  }

  @Get('redirect')
  @UseGuards(FortytwoOauthGuard)
  HandleRedirect(@Req() request) {
    console.log(request.user);
    return 'good';
  }
}
