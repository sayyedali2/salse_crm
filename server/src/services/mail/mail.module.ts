import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UsersModule)],
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
