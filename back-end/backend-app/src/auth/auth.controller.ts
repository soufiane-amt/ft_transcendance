import { Controller, Get, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {


    // get /auth/login
    // this is the route users will use to authenticate
    @Get('login')
    login(){
        return 'login page';
    };

    //get /auth/redirect
    // this is the redirect url the Oauth2 provider will call
    @Get('redirect')
    redirect(){
        return 'change data page';
    };


    // get /auth/status
    // retrive the auth status
    @Get('status')
    status(){};

    // get /auth/logout
    // logging the user out
    @Get('logout')
    logout(){};
}
