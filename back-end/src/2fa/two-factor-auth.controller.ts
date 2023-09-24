import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twofaservice: TwoFactorAuthService,
    private readonly authservice: AuthService,
    private readonly service: PrismaService,
  ) {}

  @Get('generate')
  @UseGuards(JwtAuthGuard)
  async GenrateHandler(@Req() request, @Res() response) {
    try {
      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);
      const user = await this.service.prismaClient.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      const data: any =
        await this.twofaservice.generateTwoFactorAuthSecret(user);
      return this.twofaservice.pipeQrCodeStream(response, data.otpauthUrl);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('activate')
  @UseGuards(JwtAuthGuard)
  async ActivateHandler(
    @Req() request,
    @Res() response: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    try {
      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);

      const user = await this.service.prismaClient.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      const iscodevalid = this.twofaservice.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );

      if (!iscodevalid)
        throw new UnauthorizedException('Wrong authentication code');
      else {
        await this.service.prismaClient.user.update({
          where: {
            email: payload.email,
          },
          data: {
            isTwoFactorAuthenticationEnabled: true,
          },
        });
      }
      response.json({ message: 'Two factor auth activated succesfully' });
    } catch (error) {
      response.status(error.status).json({ message: error.message });
    }
  }

  @Post('desactivate')
  @UseGuards(JwtAuthGuard)
  async DesactivateHandler(
    @Req() request,
    @Res() response: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    try {
      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);

      const user = await this.service.prismaClient.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      const iscodevalid = this.twofaservice.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );

      if (!iscodevalid)
        throw new UnauthorizedException('Wrong authentication code');
      else {
        await this.service.prismaClient.user.update({
          where: {
            email: payload.email,
          },
          data: {
            isTwoFactorAuthenticationEnabled: false,
          },
        });
      }
      response.json({ message: 'Two factor auth activated succesfully' });
    } catch (error) {
      response.status(error.status).json({ message: error.message });
    }
  }

  @Post('login')
  async HandleLogin(@Req() request, @Res() response: Response, @Body() { twoFactorAuthenticationCode },) {
    try {
      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);

      const user = await this.service.prismaClient.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      const iscodevalid = this.twofaservice.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
        );
      if (!iscodevalid)
        throw new UnauthorizedException('Wrong authentication code');
      else
      {
        const token = await this.authservice.signToken(user.id, user.email);
        // response.clearCookie('twofa_token');
        // response.cookie('access_token', token, {
        //   maxAge: 86400000,
        //   secure: false,
        // });


        response.json({ message: 'Two factor auth activated succesfully' , accessToken: token});
        // return response.redirect(`${process.env.FRONT_SERV}/dashboard`);
      }
    } catch (err) {
      response.status(err.status).json({ message: err.message });
    }
  }
}
