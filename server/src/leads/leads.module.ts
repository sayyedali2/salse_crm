import { Module } from '@nestjs/common';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  providers: [LeadsResolver, LeadsService],
})
export class LeadsModule {}
