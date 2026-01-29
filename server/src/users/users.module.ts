import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/userSchema';
import { UsersResolver } from './users.resolver';
import { MailModule } from 'src/services/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';


const UsersMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [
    UsersMongooseModule,
    forwardRef(() => MailModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersMongooseModule],
})
export class UsersModule {}
