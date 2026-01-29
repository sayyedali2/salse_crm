import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeadInput } from './dto/create-lead.input';
import { MailService } from 'src/services/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import PDFDocument = require('pdfkit');
import { UpdateLeadInput } from './dto/update-lead';
import * as XLSX from 'xlsx';
import { OrganizationService } from 'src/organization/organization.service';
import { decyptKey } from 'src/utils/encryption.utils';
import { UsersService } from 'src/users/users.service';
import { assign } from 'nodemailer/lib/shared';
import { globalPubSub } from '../pubsub-instance';

interface ExcelLead {
  Name: string;
  Email: string;
  Phone: string;
  Source: string;
  Budget: string;
  'Service Type': string;
  Status: string;
}

@Injectable()
export class LeadsService {
  logger: any;
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private mailService: MailService,
    @Inject(forwardRef(() => OrganizationService))
    private organizationService: OrganizationService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

  async createLead(
    createLeadInput: CreateLeadInput,
    organizationId: string,
    userId?: string,
  ): Promise<Lead> {
    const activeLead = await this.leadModel.findOne({
      email: createLeadInput.email,
      status: { $nin: ['WON', 'LOST', 'REJECTED'] },
      organizationId: new Types.ObjectId(organizationId),
    });
    const org = await this.organizationService.findOne({ _id: organizationId });
    if (!org) throw new NotFoundException('organization not found');

    // Check if email service is enabled and keys exist
    let emailServiceStatus = org.emailServiceStatus;
    let ApiKey = '';

    if (emailServiceStatus && org.apiKey && org.iv) {
      try {
        ApiKey = decyptKey(org.apiKey, org.iv);
      } catch (e) {
        console.error('Error decrypting key:', e);
        emailServiceStatus = false; // Disable if decryption fails
      }
    } else {
      emailServiceStatus = false; // Disable if keys missing or status false
    }

    let leadToSave: LeadDocument;
    let isNew = false;

    // AUTO ASSIGNMENT LOGIC
    if (!userId) {
      const bestAgentId = await this.getBestAgent(organizationId);
      if (bestAgentId) {
        userId = bestAgentId;
      }
    }

    if (activeLead) {
      leadToSave = activeLead;

      leadToSave.budget = createLeadInput.budget;
      leadToSave.timeline.push({
        event: `Lead Updated via Form (Budget: ${createLeadInput.budget})`,
        timestamp: new Date(),
      });
    } else {
      leadToSave = new this.leadModel({
        ...createLeadInput,
        organizationId: new Types.ObjectId(organizationId),
        assignedTo: userId ? new Types.ObjectId(userId) : null,
      });
      isNew = true;
      if (leadToSave.assignedTo) {
        await this.userService.incrementLeadCount(organizationId, userId, 1);
      }
    }

    if (!emailServiceStatus) {
      return (await leadToSave.save()).populate('assignedTo');
    }

    if (createLeadInput.budget < 3000) {
      if (isNew || leadToSave.status !== 'REJECTED') {
        leadToSave.status = 'REJECTED';
        leadToSave.timeline.push({
          event: 'Auto-Rejected: Budget too low (<3k)',
          timestamp: new Date(),
        });
        this.mailService.sendRejectionEmail(leadToSave.email, leadToSave.name, {
          apiKey: ApiKey || '',
          fromEmail: org.senderEmail || '',
        });
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
          leadToSave._id.toString(),
          {
            apiKey: ApiKey || '',
            fromEmail: org.senderEmail || '',
          },
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
            {
              apiKey: ApiKey || '',
              fromEmail: org.senderEmail || '',
            },
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

    return (await leadToSave.save()).populate('assignedTo');
  }

  async getAllLeads(organizationId: string, skip: number, take: number) {
    const query = { organizationId: new Types.ObjectId(organizationId) };
    const [items, totalCount] = await Promise.all([
      this.leadModel
        .find(query)
        .populate('assignedTo')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(take)
        .exec(),
      this.leadModel.countDocuments(query).exec(), // Ye count batayega kitne total leads hain
    ]);

    return { items, totalCount };
  }

  async getLeadsByUser(
    organizationId: string,
    userID: string,
    skip: number,
    take: number,
  ): Promise<{ items: Lead[]; totalCount: number }> {
    const query = {
      organizationId: new Types.ObjectId(organizationId),
      assignedTo: new Types.ObjectId(userID) as any,
    };

    const [items, totalCount] = await Promise.all([
      this.leadModel
        .find(query)
        .populate('assignedTo')
        .sort({ createdAt: 1 }) // Sorted for consistency
        .skip(skip)
        .limit(take)
        .exec(),
      this.leadModel.countDocuments(query).exec(),
    ]);

    return { items, totalCount };
  }

  async findOne(filter: any, organizationId: string): Promise<Lead> {
    const lead = await this.leadModel
      .findOne({
        ...filter,
        organizationId: new Types.ObjectId(organizationId),
      })
      .populate('assignedTo')
      .exec();
    if (!lead) throw new Error('Lead not found');
    return lead;
  }

  async updateStatus(
    id: string,
    status: string,
    organizationId: string,
  ): Promise<Lead> {
    const lead = await this.leadModel.findOne({
      _id: id,
      organizationId: new Types.ObjectId(organizationId),
    });
    if (!lead) throw new Error('Lead not found');
    const oldStatus = lead.status;
    const closingStatuses = ['WON', 'LOST', 'REJECTED'];

    // LOGIC: Agar lead pehle "Active" thi aur ab "Close" ho rahi hai
    const wasActive = !closingStatuses.includes(oldStatus);
    const isClosing = closingStatuses.includes(status);

    if (wasActive && isClosing && lead.assignedTo) {
      // Agent free ho gaya! Count -1 karo
      await this.userService.incrementLeadCount(
        organizationId,
        lead.assignedTo.toString(),
        -1,
      );
    }
    // Reverse Logic: Agar koi galti se WON lead ko wapas NEW kar de (Rare case)
    else if (!wasActive && !isClosing && lead.assignedTo) {
      await this.userService.incrementLeadCount(
        organizationId,
        lead.assignedTo.toString(),
        1,
      );
    }

    // 2. Status update aur timeline entry
    lead.status = status;
    lead.timeline.push({
      event: `Status changed from ${oldStatus} to ${status}`,
      timestamp: new Date(),
    });

    return (await lead.save()).populate('assignedTo');
  }

  async updateLead(id: string, data: UpdateLeadInput, organizationId: string) {
    const updatedLead = await this.leadModel
      .findOneAndUpdate(
        {
          _id: id,
          organizationId: new Types.ObjectId(organizationId),
        },
        data,
        { new: true }, // updated document return karega
      )
      .populate('assignedTo');

    if (!updatedLead) {
      throw new BadRequestException('Lead not found!!');
    }

    return updatedLead;
  }

  async deleteLead(id: string, organizationId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID');
    }

    const deletedLead = await this.leadModel.findOneAndDelete({
      _id: id,
      organizationId: new Types.ObjectId(organizationId),
    });
    if (!deletedLead) {
      throw new Error('Lead not found');
    }

    return true; // Successfully deleted
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
      await this.mailService.sendBookingReminder(
        lead.email,
        lead.name,
        lead._id.toString(),
      );

      // Update Timeline (Taaki dobara email na jaye)
      lead.timeline.push({
        event: 'System: 24h Reminder Sent',
        timestamp: new Date(),
      });

      await lead.save();
    }
  }

  // ... inside LeadsService class

  async generateProposalPDF(
    leadId: string,
    organizationId: string,
  ): Promise<Buffer> {
    const lead = await this.leadModel.findOne({
      _id: leadId,
      organizationId: new Types.ObjectId(organizationId),
    });
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

  async importLeadsFromExcel(
    fileBuffer: Buffer,
    orgId: string,
    userId: string, // Ye admin ki ID hai jo upload kar raha hai
  ) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rowData: any[] = XLSX.utils.sheet_to_json(sheet);
    if (!rowData.length) throw new BadRequestException('Excel file is empty');

    // 1. Central Engine ko call karke assignment karwayi
    // Note: Humein wahi data bhejna hai jisme 'Email' ho
    const validRows = rowData.filter((row) => row['Email']);
    const { assignedLeads, userLoadUpdates } = await this.handleBulkAssignment(
      validRows,
      orgId,
    );

    const now = new Date();

    // 2. Leads ka final data taiyaar karein
    const operations = assignedLeads.map((lead) => ({
      updateOne: {
        filter: {
          email: lead['Email'].toString().toLowerCase().trim(),
          organizationId: new Types.ObjectId(orgId),
        },
        update: {
          $set: {
            name: lead['Name'] || 'Unknown',
            email: lead['Email'].toString().toLowerCase().trim(),
            phone: lead['Phone'],
            organizationId: new Types.ObjectId(orgId),
            assignedTo: lead.assignedTo, // ENGINE WALI ID
            source: lead['Source'] || 'Excel Import',
            budget: lead['Budget'],
            serviceType: lead['Service Type'],
            status: lead['Status'] || 'New',
            timeline: [{ event: 'System: Lead Imported', timestamp: now }],
          },
        },
        upsert: true,
      },
    }));

    try {
      // 3. Leads ko Bulk Insert karein
      const result = await this.leadModel.bulkWrite(operations);

      // 4. Sabse Important: Users ka Workload Sync karein
      // Sirf unhi users ko update karein jinhe leads mili hain
      if (userLoadUpdates.size > 0) {
        const userBulkOps = Array.from(userLoadUpdates).map(
          ([agentId, count]) => ({
            updateOne: {
              filter: { _id: new Types.ObjectId(agentId) },
              update: { $inc: { activeLeadsCount: count } },
            },
          }),
        );

        await this.userService.bulkWrite(userBulkOps);
      }

      // --- REAL-TIME UPDATE LOGIC ---
      const emails = assignedLeads.map((l) =>
        l['Email'].toString().toLowerCase().trim(),
      );
      console.log(`[Import] Emails to find: ${emails.length}`);

      const updatedLeads = await this.leadModel
        .find({
          email: { $in: emails },
          organizationId: new Types.ObjectId(orgId),
        })
        .populate('assignedTo');

      console.log(`[Import] Found ${updatedLeads.length} leads to publish.`);

      for (const lead of updatedLeads) {
        const leadToPublish = JSON.parse(JSON.stringify(lead));
        // Using 'leadAdded' ensures new leads appear in the list.
        await globalPubSub.publish('leadAdded', { leadAdded: leadToPublish });
        // console.log(`[Import] Published lead: ${lead.email}`);
      }

      return {
        count: result.upsertedCount + result.modifiedCount,
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Partial upload or database error',
        count: (error.result?.nUpserted || 0) + (error.result?.nModified || 0),
      };
    }
  }

  async handleSingleAssignment(
    leadId: string,
    organizationId: string,
    manualUserId: string,
  ) {
    // 1. User aur Lead dono ko ek saath fetch karein (Parallel processing for speed)
    const [user, lead] = await Promise.all([
      this.userService.findOne({ organizationId, _id: manualUserId }),
      this.leadModel.findOne({ _id: leadId, organizationId }), // Org check yahan bhi zaroori hai safety ke liye
    ]);

    if (!user)
      throw new NotFoundException('User not found in this organization');
    if (!lead) throw new NotFoundException('Lead not found');

    const previousAgentId = lead.assignedTo?.toString();

    // Agar lead usi bande ko dobara assign ho rahi hai, toh kuch mat karo
    if (previousAgentId === manualUserId) return lead;

    // 2. Assignment Update
    lead.assignedTo = user._id as any;
    await lead.save();

    // 3. Workload Sync (Logic Layer)
    // Purane bande ka -1 karo
    if (previousAgentId) {
      await this.userService.incrementLeadCount(
        organizationId,
        previousAgentId,
        -1,
      );
    }

    // Naye bande ka +1 karo
    await this.userService.incrementLeadCount(organizationId, manualUserId, 1);

    return lead;
  }

  async handleBulkAssignment(leadsData: any[], organizationId: string) {
    // 1. Saare assignable agents ko ek hi baar fetch kiya (Performance!)
    const agents = await this.userService.getAll({
      organizationId,
      isAssignable: true,
      status: 'ACTIVE',
    });

    if (!agents.length) throw new Error('No assignable agents found');

    // 2. Memory mein distribution track karne ke liye Map
    const userLoadUpdates = new Map<string, number>();

    const assignedLeads = leadsData.map((lead) => {
      // Agents ko workload ke hisaab se sort karein
      agents.sort((a, b) => {
        const aCount =
          typeof a.activeLeadsCount === 'number' ? a.activeLeadsCount : 0;
        const bCount =
          typeof b.activeLeadsCount === 'number' ? b.activeLeadsCount : 0;
        return aCount - bCount;
      });
      const bestAgent: any = agents[0];

      // Memory mein count update
      bestAgent.activeLeadsCount =
        (typeof bestAgent.activeLeadsCount === 'number'
          ? bestAgent.activeLeadsCount
          : 0) + 1;

      // Track ki kis agent ko kitni leads mili (for Bulk Sync)
      const currentCount = userLoadUpdates.get(bestAgent._id.toString()) || 0;
      userLoadUpdates.set(bestAgent._id.toString(), currentCount + 1);

      return {
        ...lead,
        assignedTo: bestAgent._id,
        organizationId: organizationId,
      };
    });

    return { assignedLeads, userLoadUpdates };
  }

  async getBestAgent(organizationId: string): Promise<string | null> {
    try {
      const agents = await this.userService.getAll({
        organizationId,
        isAssignable: true,
        status: 'ACTIVE',
      });

      if (!agents || agents.length === 0) return null;

      // Sort by activeLeadsCount (ascending) - Jiske paas kam leads hain usko pehle
      agents.sort((a, b) => {
        const countA = (a as any).activeLeadsCount || 0;
        const countB = (b as any).activeLeadsCount || 0;
        return countA - countB;
      });

      return agents[0]._id.toString();
    } catch (error) {
      console.error('Error finding best agent:', error);
      return null;
    }
  }
}
