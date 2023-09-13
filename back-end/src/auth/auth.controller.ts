import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import FortytwoOauthGuard from './guards/Fortytwo-Oauth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-aut.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly service: PrismaService,
  ) {}
  //===================================================================================

  @Get('login')
  @UseGuards(FortytwoOauthGuard)
  async HandleLogin() {}
  //===================================================================================

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
      return response.redirect(`${process.env.FRONT_SERV}/dashboard`);

    // return response.redirect('http://localhost:3001/profile');
    // return response.status(200).send('done');
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
    }),
  )
  async HandleUpdateCredentials(
    @Req() request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const UpdatedData: any = {
        AvatarPath: `http://localhost:3001/auth/uploads/${file.filename}`, // put backend domain in the env
        ...request.body,
      };

      const JwtToken: string = request.headers.authorization.split(' ')[1];
      const payload: any = this.authservice.extractPayload(JwtToken);

      try {
        await this.service.user.update({
          where: {
            email: payload.email,
          },
          data: {
            login: UpdatedData.NickName,
            firstname: UpdatedData.FirstName,
            lastname: UpdatedData.LastName,
            avatar: UpdatedData.AvatarPath,
          },
        });
      } catch (error) {
        response.status(500).json({ message: 'Error saving credentials' });
      }
      response.json({ message: 'Credentials updated successfully' });
    } catch (error) {
      response.status(500).json({ message: 'Error updating credentials' });
    }
  }

  //===================================================================================
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async HandleProfilepic(@Req() request, @Res() response: Response) {
    const JwtToken: string = request.headers.authorization.split(' ')[1];

    const payload: any = this.authservice.extractPayload(JwtToken);
    const user = await this.service.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    return response.status(200).send(user);
  }

  //===============================
  @Get('uploads/:filename')
  @UseGuards(JwtAuthGuard)
  async getPicture(@Param('filename') filename, @Res() response: Response) {
    response.sendFile(filename, { root: './uploads' });
  }
}
