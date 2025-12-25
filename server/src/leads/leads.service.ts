import { Injectable } from '@nestjs/common';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeadInput } from './dto/create-lead.input';
import { MailService } from '../mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import PDFDocument = require('pdfkit');

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

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new Error('Lead not found');
    return lead;
  }
  '694bb4f777bd73bf0785678d';
  async updateStatus(id: string, status: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id);
    if (!lead) throw new Error('Lead not found');

    lead.status = status;

    // Add log to timeline
    lead.timeline.push({
      event: `Status changed manually to ${status}`,
      timestamp: new Date(),
    });

    return lead.save();
  }

  // ... LeadsService class ke andar

  // ✅ CRON JOB: Har roz subah 10 baje chalega
  // Testing ke liye aap CronExpression.EVERY_30_SECONDS use kar sakte hain
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleFollowUpCron() {
    console.log('🔄 Running Daily Follow-up Job...');

    //Calculate time: 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    //Find leads: jo Qualified hain, 24h purani hain, aur "Remainder nahi mila"
    const leadsToRemind = await this.leadModel.find({
      status: 'QUALIFIED',
      createdAt: { $lte: twentyFourHoursAgo },
      'timeline.event': { $ne: 'System: 24h Reminder Sent' },
    });
    if (leadsToRemind.length === 0) {
      console.log('✅ No pending follow-ups found.');
      return;
    }

    console.log(`🚀 Found ${leadsToRemind.length} leads to remind.`);

    for (const lead of leadsToRemind) {
      // Send Email
      await this.mailService.sendBookingReminder(lead.email, lead.name);

      // Update Timeline (Taaki dobara email na jaye)
      lead.timeline.push({
        event: 'System: 24h Reminder Sent',
        timestamp: new Date(),
      });

      await lead.save();
    }
  }

  // ... inside LeadsService class

  async generateProposalPDF(leadId: string): Promise<Buffer> {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) throw new Error('Lead not found');

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // --- PDF DESIGN START ---

      // 1. Header
      doc.fontSize(20).text('PROJECT PROPOSAL', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Date: ${new Date().toDateString()}`, { align: 'right' });

      // 2. Client Details
      doc.moveDown();
      doc.fontSize(14).text(`To: ${lead.name}`);
      const clientEmail =
        (lead as Partial<Lead & { clientEmail?: string }>).clientEmail ||
        lead.email;
      doc.fontSize(10).text(`Email: ${clientEmail}`); // Fallback if schema differs
      doc.moveDown();

      // 3. Subject
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`Subject: Proposal for ${lead.serviceType}`);
      doc.font('Helvetica').moveDown();

      // 4. Body
      doc.text(`Dear ${lead.name},`);
      doc.moveDown();
      doc.text(
        `Thank you for giving us the opportunity to quote for your project. Based on our discussion, here is the estimated cost breakdown:`,
      );
      doc.moveDown();

      // 5. Pricing Table (Simple)
      const y = doc.y;
      doc.font('Helvetica-Bold').text('Service', 50, y);
      doc.text('Cost (INR)', 400, y);
      doc.font('Helvetica').moveDown();

      // Line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Item
      const itemY = doc.y;
      doc.text(lead.serviceType, 50, itemY);
      doc.text(`Rs. ${lead.budget.toLocaleString()}`, 400, itemY);

      doc.moveDown(2);

      // 6. Total
      doc
        .fontSize(14)
        .text(`Total Estimate: Rs. ${lead.budget.toLocaleString()}`, {
          align: 'right',
        });

      // 7. Footer
      doc.moveDown(4);
      doc.fontSize(10);
      doc
        .fillColor('grey')
        .text('Terms: Valid for 14 days.', { align: 'center' });
      doc
        .fillColor('black')
        .text('Generated by SalesPilot CRM', { align: 'center' });

      // --- PDF DESIGN END ---

      doc.end();
    });
  }
}
