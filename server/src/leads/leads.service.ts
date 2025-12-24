import { Injectable } from '@nestjs/common';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeadInput } from './dto/create-lead.input';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) {}

  async createLead(createLeadInput: CreateLeadInput): Promise<Lead> {
    const existingLead = await this.leadModel.findOne({
      email: createLeadInput.email,
    });
    if (existingLead) {
      throw new BadRequestException('Lead with this email already exists!');
    }
    let status = 'NEW';
    const timeline: { event: string }[] = [];

    if (createLeadInput.budget < 3000) {
      status = 'REJECTED';
      timeline.push({ event: 'Auto-Rejected: Budget to low (<3k)' });
    } else if (createLeadInput.budget > 50000) {
      status = 'QUALIFIED';
      timeline.push({ event: 'Auto-Qualified: Budget high enough (>50k)' });
    } else {
      timeline.push({ event: 'Lead Created: Needs Manual Review' });
    }

    const newLead = new this.leadModel({
      ...createLeadInput,
      status,
      timeline,
    });
    return newLead.save();
  }

  async getAllLeads(): Promise<Lead[]> {
    return this.leadModel.find().exec();
  }
}
