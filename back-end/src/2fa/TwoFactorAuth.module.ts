import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TwoFactorAuthService ,],
  controllers: [TwoFactorAuthController],
  imports: [AuthModule]
})
export class TwoFactorAuth {}
