import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/services/mail/mail.module';
import { PubSubModule } from 'src/common/pubsub.module';
import { AuthModule } from 'src/auth/auth.module';
import { LeadsController } from './leads.controller';
import { OrganizationModule } from 'src/organization/organization.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    UsersModule, // ✅ For AuthGuard
    forwardRef(() => OrganizationModule),
    forwardRef(() => MailModule),
    PubSubModule,
    forwardRef(() => AuthModule),
  ],
  providers: [LeadsResolver, LeadsService],
  exports: [LeadsService],
  controllers: [LeadsController],
})
export class LeadsModule {}
