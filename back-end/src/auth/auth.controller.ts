import { Controller, Get, Res, UseGuards} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';

@Controller()
export class AuthController {

    constructor(private readonly service: PrismaService){}

    // get /login
    // this is the route users will use to authenticate
    @Get('login')
    @UseGuards(FortytwoOauthGuard)
    async    HandleLogin(){
        return 'this is login page';
        }
    //get /redirect
    // this is the redirect url the Oauth2 provider will call
    @Get('redirect')
    @UseGuards(FortytwoOauthGuard)
    HandleRedirect(@Res() response){
        return response.status(200).json({msg: "good"});
    };
};