import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { CreateLeadInput } from './dto/create-lead.input';
import { Lead } from './schemas/lead.schema';
import { MailService } from '../mail/mail.service';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly mailService: MailService,
  ) {}

  @Mutation(() => Lead)
  async createLead(
    @Args('createLeadInput') createLeadInput: CreateLeadInput,
  ): Promise<Lead> {
    return this.leadsService.createLead(createLeadInput);
  }

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(): Promise<Lead[]> {
    return this.leadsService.getAllLeads();
  }

  @Mutation(() => Lead)
  async updateLeadStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => String }) status: string,
  ) {
    return this.leadsService.updateStatus(id, status);
  }

  @Mutation(() => Boolean) // Returns true if sent successfully
  async sendProposal(@Args('id') id: string) {
    // 1. PDF Generate karo
    const pdfBuffer = await this.leadsService.generateProposalPDF(id);

    // 2. Lead details fetch karo (Email ke liye)
    const lead = await this.leadsService.findOne(id);

    // 3. Email bhejo
    await this.mailService.sendProposalEmail(lead.email, lead.name, pdfBuffer);

    // 4. Status update karo (Optional)
    await this.leadsService.updateStatus(id, 'PROPOSAL_SENT');

    return true;
  }
}
