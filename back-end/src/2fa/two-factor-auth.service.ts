import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toFileStream } from 'qrcode';
@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly service: PrismaService) {}

  async generateTwoFactorAuthSecret(user) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );

    try {
      await this.service.prismaClient.user.update({
        where: {
          email: user.email,
        },
        data: {
          twoFactorAuthenticationSecret: secret,
        },
      });
    } catch (err) {
      console.log(err);
    }
    return { secret, otpauthUrl };
  }
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }
}
