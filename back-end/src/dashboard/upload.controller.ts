import { Controller, Post, UseInterceptors, UploadedFile, Header, Req, UseGuards, Res, Body, Param, Get, UnsupportedMediaTypeException, HttpException, HttpStatus } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage} from 'multer';
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-aut.guard";
import { UserCrudService } from "src/prisma/user-crud.service";


@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController
{
    constructor(private readonly user : UserCrudService, private readonly authservice: AuthService){};

  //===============================
  // @Get(':filename')
  // @UseGuards(JwtAuthGuard)
  // async getPicture(@Param('filename') filename, @Res() response: Response) {
  //   response.sendFile(filename, { root: './uploads' });
  // }




    @Post('file')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (rep, file, cb) => {
                    const parts = file.originalname.split('.');
                    const fileExtension = parts.pop();
                    const name = parts.join('.');
                    const uniqueSuffix = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
                    cb(null, uniqueSuffix);
                },
            }),
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/))
                  cb(null, false);
                else cb(null, true);
              },
        }),
    )
    
    async uploadFile(@UploadedFile() file : Express.Multer.File ,@Req() request, @Res() response : Response, @Body() body)
    {
        try {
            const authorizationHeader = request.headers.authorization;
            const check = request.headers.check;
            if (!file)
                    throw new UnsupportedMediaTypeException(
                      'Invalid file type. Only jpg, jpeg, png, gif, bmp, tiff images are allowed.',
            );
            if (authorizationHeader && !check)
            {
                const tokenParts = authorizationHeader.split(' ');
                const JwtToken: string = tokenParts[1];
            
                try {
                  const payload: any = this.authservice.extractPayload(JwtToken);
                  this.user.changeUserAvatar(payload.userId, `${process.env.BACKEND_SERV}/auth/uploads/${file.filename}`);
                } catch (error) {
                  // Handle any errors that occur during the process
                  console.error('Error:', error);
                }
            }
            else if (authorizationHeader && check)
            {
              const tokenParts = authorizationHeader.split(' ');
                const JwtToken: string = tokenParts[1];
            
                try {
                  const payload: any = this.authservice.extractPayload(JwtToken);
                  this.user.changeUserBackgroundImg(payload.userId, `${process.env.BACKEND_SERV}/auth/uploads/${file.filename}`);
                  response.ok;
                } catch (error) {
                  // console.error('Error:', error);
                }
            }
          }
            catch (error) {
            // console.error('Error during file upload:', error);
            throw new HttpException('File format is not supported', HttpStatus.BAD_REQUEST);
          }
    }

    
}