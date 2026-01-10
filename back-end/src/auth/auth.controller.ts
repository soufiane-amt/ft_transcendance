import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-aut.guard';
import { PrismaService } from '../prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly service: PrismaService,
  ) {}
  //===================================================================================

  @Get('login')
  // @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {}
  //===================================================================================

  @Get('redirect')
  // @UseGuards(FortytwoOauthGuard)
  async HandleRedirect(@Req() request, @Res() response: Response) {
    const token = await this.authservice.signIn(request.user);
    const user = await this.service.prismaClient.user.findUnique({
      where: {
        email: request.user.email,
      },
    });
    if (user.firstauth === true) {
      response.cookie('access_token', token, {
        maxAge: 86400000,
        secure: false,
      });
      await this.service.prismaClient.user.update({
        where: {
          email: request.user.email,
        },
        data: {
          firstauth: false,
        },
      });
      return response.redirect(`${process.env.FRONT_SERV}/updatecredentials`);
    } else if (
      user.isTwoFactorAuthenticationEnabled === true &&
      request.cookies['access_token'] === undefined
    ) {
      const TwoFaToken = await this.authservice.TwoFaToken(user.email);
      response.cookie('twofa_token', TwoFaToken, {
        maxAge: 86400000,
        secure: false,
      });
      return response.redirect(`${process.env.FRONT_SERV}/2fa`);
    } else {
      response.cookie('access_token', token, {
        maxAge: 86400000,
        secure: false,
      });
      return response.redirect(`${process.env.FRONT_SERV}/dashboard`);
    }
  }

  // Local register
  @Post('register')
  async registerLocal(@Body() body: RegisterDto, @Res() response: Response) {
    try {
      const token = await this.authservice.registerLocal(body);
      return response.json({ access_token: token });
    } catch (error) {
      return response
        .status(error.status || 500)
        .json({ message: error.message });
    }
  }

  // Local login
  @Post('login/local')
  async loginLocal(@Body() body: LoginDto, @Res() response: Response) {
    try {
      const token = await this.authservice.validateLocal(
        body.email,
        body.password,
      );
      return response.json({ access_token: token });
    } catch (error) {
      return response
        .status(error.status || 401)
        .json({ message: error.message });
    }
  }

  //============================================================================
  @Post('updatecredentials')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('ProfilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const parts = file.originalname.split('.');
          const fileExtension = parts.pop(); // Get the last part as the extension
          const name = parts.join('.'); // Join the remaining parts as the name

          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFileName);
        },
      }),
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/))
          cb(null, false);
        else cb(null, true);
      },
    }),
  )
  async HandleUpdateCredentials(
    @Req() request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file)
        throw new UnsupportedMediaTypeException(
          'Invalid file type. Only jpg, jpeg, png, gif, bmp, tiff images are allowed.',
        );
      const UpdatedData: any = {
        AvatarPath: `${process.env.BACKEND_SERV}/auth/uploads/${file.filename}`, // put backend domain in the env
        ...request.body,
      };

      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);

      try {
        await this.service.prismaClient.user.update({
          where: {
            email: payload.email,
          },
          data: {
            username: UpdatedData.NickName,
            firstname: UpdatedData.FirstName,
            lastname: UpdatedData.LastName,
            avatar: UpdatedData.AvatarPath,
          },
        });
      } catch (error) {
        throw new BadRequestException('database error');
      }
      response.json({ message: 'Credentials updated successfully' });
    } catch (error) {
      response.status(error.status).json({ message: error.message });
    }
  }

  //===================================================================================
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async HandleProfilepic(@Req() request, @Res() response: Response) {
    const JwtToken: string = request.headers.authorization.split(' ')[1];

    const payload: any = this.authservice.extractPayload(JwtToken);
    const user = await this.service.prismaClient.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    return response.status(200).send(user);
  }

  //===============================
  @Get('uploads/:filename')
  // @UseGuards(JwtAuthGuard)
  async getPicture(@Param('filename') filename, @Res() response: Response) {
    response.sendFile(filename, { root: './uploads' });
  }
}
