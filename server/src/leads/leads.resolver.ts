import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { CreateLeadInput } from './dto/create-lead.input';
import { Lead } from './schemas/lead.schema';
import { MailService } from '../mail/mail.service';
import { UpdateLeadInput } from './dto/update-lead';
import { globalPubSub } from '../pubsub-instance';
// ✅ Custom Interface jo TS error ko khatam karega
// Removed PubSubLib interface as per instruction

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly mailService: MailService,
  ) {
    console.log('--- LEADS RESOLVER FORCED INSTANTIATION ---');
    // console.log('PubSub Instance:', globalPubSub)/;
  }

  @Subscription(() => Lead)
  leadAdded() {
    return globalPubSub.asyncIterableIterator('leadAdded');
  }

  // Consolidated to use leadUpdated for all updates
  @Subscription(() => Lead)
  leadUpdated() {
    return globalPubSub.asyncIterableIterator('leadUpdated');
  }

  @Subscription(() => String)
  leadDeleted() {
    return globalPubSub.asyncIterableIterator('leadDeleted');
  }

  // --- Mutations ---

  @Mutation(() => Lead)
  async createLead(
    @Args('createLeadInput') createLeadInput: CreateLeadInput,
  ): Promise<Lead> {
    const newLead = await this.leadsService.createLead(createLeadInput);
    const leadToPublish: unknown = JSON.parse(JSON.stringify(newLead));

    await globalPubSub.publish('leadAdded', {
      leadAdded: leadToPublish,
    });
    console.log('Publishing Lead:', newLead);
    return newLead;
  }

  @Mutation(() => Lead)
  async updateLeadStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => String }) status: string,
  ): Promise<Lead> {
    const updateStatus = await this.leadsService.updateStatus(id, status);
    // Use leadUpdated so client listening to generic update gets it
    await globalPubSub.publish('leadUpdated', {
      leadUpdated: updateStatus,
    });
    return updateStatus;
  }

  @Mutation(() => Lead)
  async UpdateLead(
    @Args('id', { type: () => String }) id: string,
    @Args('data', { type: () => UpdateLeadInput }) data: UpdateLeadInput,
  ) {
    const update = await this.leadsService.updateLead(id, data);
    await globalPubSub.publish('leadUpdated', { leadUpdated: update });
    return update;
  }

  @Mutation(() => Boolean)
  async deleteLead(@Args('id', { type: () => String }) id: string) {
    const deleted = await this.leadsService.deleteLead(id);
    // deleted is boolean, but we need to publish the ID
    if (deleted) {
      await globalPubSub.publish('leadDeleted', { leadDeleted: id });
    }
    return deleted;
  }

  @Query(() => [Lead], { name: 'leads' })
  async getLeads(): Promise<Lead[]> {
    return this.leadsService.getAllLeads();
  }

  @Mutation(() => Boolean)
  async sendProposal(@Args('id') id: string) {
    const pdfBuffer = await this.leadsService.generateProposalPDF(id);
    const lead = await this.leadsService.findOne(id);
    await this.mailService.sendProposalEmail(lead.email, lead.name, pdfBuffer);
    const updatedLead = await this.leadsService.updateStatus(
      id,
      'PROPOSAL_SENT',
    );
    await globalPubSub.publish('leadUpdated', {
      leadUpdated: updatedLead,
    });
    return true;
  }
}
