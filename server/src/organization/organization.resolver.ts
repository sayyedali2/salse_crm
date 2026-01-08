import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organizaiton } from './schemas/organization.schema';
import { CreateOrganizationInput } from 'src/auth/dto/createOrganizationInput.dto';

@Resolver()
export class OrganizationResolver {
  constructor(private organizationService: OrganizationService) {}

  @Mutation(() => Organizaiton)
  async createOrganization(@Args('input') input: CreateOrganizationInput) {
    return this.organizationService.createOrganization(input);
  }
}
