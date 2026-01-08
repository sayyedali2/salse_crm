import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[AuthModule, UsersModule],
  providers: [OrganizationService, OrganizationResolver]
})
export class OrganizationModule {}
