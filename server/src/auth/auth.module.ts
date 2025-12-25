import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Real app me ye .env file me hona chahiye
      signOptions: { expiresIn: '1d' }, // Token 1 din tak valid rahega
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
