import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { CreateLeadInput } from './dto/create-lead.input';
import { Lead } from './schemas/lead.schema';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

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
}
