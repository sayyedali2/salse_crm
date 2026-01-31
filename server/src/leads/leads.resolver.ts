import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  Context,
  Int,
} from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { CreateLeadInput } from './dto/create-lead.input';
import { Lead } from './schemas/lead.schema';
import { MailService } from 'src/services/mail/mail.service';
import { UpdateLeadInput } from './dto/update-lead';
import { globalPubSub } from '../pubsub-instance';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';
import { Permission } from 'src/common/decorator/permission/permission.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
import { PaginatedLeads } from './dto/pagination.input';

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
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_CREATE)
  async createLead(
    @Args('createLeadInput') createLeadInput: CreateLeadInput,
    @Context() context: any,
    @Args('manualUserId', { type: () => String, nullable: true })
    manualUserId?: string,
  ): Promise<Lead> {
    const finalAssigneeId = manualUserId
      ? manualUserId // Admin ne select kiya
      : String(context.req.user.isAssignable) === 'false'
        ? null // Admin ne select nahi kiya -> Service handles "Auto-Assign"
        : context.req.user._id; // Agent ne create kiya -> Khud ko assign
    try {
      const newLead = await this.leadsService.createLead(
        createLeadInput,
        context.req.user.organizationId,
        finalAssigneeId,
      );
      console.log('CreateLead - User:', context.req.user);
      console.log('CreateLead - AssignedTo:', newLead.assignedTo);

      const leadToPublish: unknown = JSON.parse(JSON.stringify(newLead));

      await globalPubSub.publish('leadAdded', {
        leadAdded: leadToPublish,
      });
      console.log('Publishing Lead:', newLead);
      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  @Mutation(() => Lead)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_EDIT)
  async updateLeadStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => String }) status: string,
    @Context() context: any,
  ): Promise<Lead> {
    const updateStatus = await this.leadsService.updateStatus(
      id,
      status,
      context.req.user.organizationId,
    );
    // Use leadUpdated so client listening to generic update gets it
    await globalPubSub.publish('leadUpdated', {
      leadUpdated: updateStatus,
    });
    return updateStatus;
  }

  @Mutation(() => Lead)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_EDIT)
  async UpdateLead(
    @Args('id', { type: () => String }) id: string,
    @Args('data', { type: () => UpdateLeadInput }) data: UpdateLeadInput,
    @Context() context: any,
  ) {
    const update = await this.leadsService.updateLead(
      id,
      data,
      context.req.user.organizationId,
    );
    await globalPubSub.publish('leadUpdated', { leadUpdated: update });
    return update;
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_DELETE)
  async deleteLead(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ) {
    const deleted = await this.leadsService.deleteLead(
      id,
      context.req.user.organizationId,
    );
    // deleted is boolean, but we need to publish the ID
    if (deleted) {
      await globalPubSub.publish('leadDeleted', { leadDeleted: id });
    }
    return deleted;
  }

  @Query(() => PaginatedLeads, { name: 'leads' })
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_VIEW_ALL, PERMISSIONS.LEADS_VIEW_OWN)
  async getLeads(
    @Context() context: any,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ) {
    const userRole = context.req.user.role;
    if (userRole?.permissions?.includes(PERMISSIONS.LEADS_VIEW_ALL)) {
      const { items, totalCount } = await this.leadsService.getAllLeads(
        context.req.user.organizationId,
        skip,
        take,
      );
      return { items, totalCount };
    } else {
      return this.leadsService.getLeadsByUser(
        context.req.user.organizationId,
        context.req.user._id,
        skip,
        take,
      );
    }
  }

  @Query(() => Lead)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_VIEW_ALL)
  async getLead(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ) {
    return this.leadsService.findOne(
      { _id: id },
      context.req.user.organizationId,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async sendProposal(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ) {
    const pdfBuffer = await this.leadsService.generateProposalPDF(
      id,
      context.req.user.organizationId,
    );
    const lead = await this.leadsService.findOne(
      { _id: id },
      context.req.user.organizationId,
    );
    await this.mailService.sendProposalEmail(lead.email, lead.name, pdfBuffer);
    const updatedLead = await this.leadsService.updateStatus(
      id,
      'PROPOSAL_SENT',
      context.req.user.organizationId,
    );
    await globalPubSub.publish('leadUpdated', {
      leadUpdated: updatedLead,
    });
    return true;
  }

  @Mutation(() => Lead)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.LEADS_ASSIGN)
  async singleLeadAssignment(
    @Args('leadId', { type: () => String }) leadId: string,
    @Args('userId', { type: () => String }) userId: string,
    @Context() context: any,
  ) {
    const orgId = context.req.user.organizationId;
    const response = await this.leadsService.handleSingleAssignment(
      leadId,
      orgId,
      userId,
    );
    return response;
  }
}
