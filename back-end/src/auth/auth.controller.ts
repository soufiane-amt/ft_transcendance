import { Controller, Get} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly service: PrismaService){}

    // get /auth/login
    // this is the route users will use to authenticate
    @Get('login')
    async login(){
        const newUser = await this.service.user.create(
         {
               data:{
                email: "hello@example.com", username: 'example'
            }
        });
        return newUser;
        }
};

    // //get /auth/redirect
    // // this is the redirect url the Oauth2 provider will call
    // @Get('redirect')
    // redirect(){
    //     return 'change data page';
    // };


    // // get /auth/status
    // // retrive the auth status
    // @Get('status')
    // status(){};

    // // get /auth/logout
    // // logging the user out
    // @Get('logout')
    // logout(){};
