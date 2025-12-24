import { Injectable } from '@nestjs/common';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeadInput } from './dto/create-lead.input';
import { MailService } from '../mail/mail.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private mailService: MailService,
  ) {}
  async createLead(createLeadInput: CreateLeadInput): Promise<Lead> {
    const activeLead = await this.leadModel.findOne({
      email: createLeadInput.email,
      status: { $nin: ['WON', 'LOST', 'REJECTED'] },
    });

    let leadToSave: LeadDocument;
    let isNew = false;

    if (activeLead) {
      leadToSave = activeLead;

      leadToSave.budget = createLeadInput.budget;
      leadToSave.timeline.push({
        event: `Lead Updated via Form (Budget: ${createLeadInput.budget})`,
        timestamp: new Date(),
      });
    } else {
      leadToSave = new this.leadModel(createLeadInput);
      isNew = true;
    }

    if (createLeadInput.budget < 3000) {
      if (isNew || leadToSave.status !== 'REJECTED') {
        leadToSave.status = 'REJECTED';
        leadToSave.timeline.push({
          event: 'Auto-Rejected: Budget too low (<3k)',
          timestamp: new Date(),
        });
        this.mailService.sendRejectionEmail(leadToSave.email, leadToSave.name);
      }
    } else if (createLeadInput.budget > 50000) {
      // Qualification Logic...
      if (isNew || leadToSave.status !== 'QUALIFIED') {
        leadToSave.status = 'QUALIFIED';
        leadToSave.timeline.push({
          event: 'Auto-Qualified: High Budget (>50k)',
          timestamp: new Date(),
        });
        this.mailService.sendQualificationEmail(
          leadToSave.email,
          leadToSave.name,
        );
      }
    } else {
      if (isNew) {
        if (isNew) {
          leadToSave.timeline.push({
            event: 'Lead Created: Moderate Budget - Needs Manual Review',
            timestamp: new Date(),
          });

          // 1. Client ko email bhejo ("Hum check kar rahe hain")
          this.mailService.sendAcknowledgementEmail(
            leadToSave.email,
            leadToSave.name,
          );
          leadToSave.timeline.push({
            event: 'System: Acknowledgement Email Sent',
            timestamp: new Date(),
          });
        } else {
          leadToSave.timeline.push({
            event: 'Lead Updated: Budget in Review Range',
            timestamp: new Date(),
          });
        }
      }
      leadToSave.status = 'NEW';
      leadToSave.timeline.push({
        event: 'Lead Created: Needs Manual Review',
        timestamp: new Date(),
      });
    }

    return leadToSave.save();
  }
  async getAllLeads(): Promise<Lead[]> {
    return this.leadModel.find().exec();
  }
}
