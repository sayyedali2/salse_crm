import { Module } from '@nestjs/common';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    MailModule,
  ],
  providers: [LeadsResolver, LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
