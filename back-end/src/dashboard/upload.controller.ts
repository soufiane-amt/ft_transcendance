import { Controller, Post, UseInterceptors, UploadedFile, Header, Req } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage} from 'multer';
import { UserCrudService } from "src/prisma/user-crud.service";


@Controller('upload')
export class UploadController
{
    constructor(private readonly user : UserCrudService){};
    @Post('file')
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
        }),
    )
    
    async uploadFile(@UploadedFile() file, @Req() request:  Request)
    {
        try {
            const authorizationHeader = request.headers['authorization'];
            if (authorizationHeader)
            {
                // this.user.changeUserAvatar()
            }
            // this.user.changeUserAvatar()
            console.log('uploa file : ', file.filename);
            return { filename: file.filename };
        } catch (error) {
            console.error('Error during file upload:', error);
            throw ('File upload failed');
        }
    }
}