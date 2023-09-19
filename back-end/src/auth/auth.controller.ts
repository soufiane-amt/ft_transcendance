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


    const token = await this.authservice.signIn(request.user); // error here !!!!!!!!
    
    response.cookie('access_token', token, {
      maxAge: 86400000,
      secure: false,
    });
    
    const user = await this.service.prismaClient.user.findUnique({
      where: {
        email: request.user.email,
      },
    });
    if (user.firstauth === true) {
      // here I will redirect the user to change the data
      await this.service.prismaClient.user.update({
        where: {
          email: request.user.email,
        },
        data: {
          firstauth: false,
        },
      });
      return response.redirect(`${process.env.FRONT_SERV}/updatecredentials`);
      // here i will redirect the user to the profile page
    } else return response.redirect(`${process.env.FRONT_SERV}/dashboard`);
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
  @UseGuards(JwtAuthGuard)
  async getPicture(@Param('filename') filename, @Res() response: Response) {
    response.sendFile(filename, { root: './uploads' });
  }
}
