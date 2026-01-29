import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationModule } from 'src/organization/organization.module';
import { RolesModule } from 'src/roles/roles.module';
import { TokensService } from 'src/services/Tokens.service';
import { MailModule } from 'src/services/mail/mail.module';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from 'src/roles/schemas/role.schema';
import { User, UserSchema } from 'src/users/schemas/userSchema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Roles.name, schema: RolesSchema }, { name: User.name, schema: UserSchema }]),
    PassportModule,
    forwardRef(() => OrganizationModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MailModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Real app me ye .env file me hona chahiye
      signOptions: { expiresIn: '1d' }, // Token 1 din tak valid rahega
    }),
  ],
  providers: [AuthService, AuthResolver, TokensService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
