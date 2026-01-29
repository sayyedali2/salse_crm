import {
  Resolver,
  Mutation,
  Args,
  Query,
  Int,
  Subscription,
  InputType,
  Field,
} from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Organization } from './schemas/organization.schema';
import { UseGuards } from '@nestjs/common';
import { Permission } from 'src/common/decorator/permission/permission.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrganizationOutput } from './dto/OrganizationOutput';
import { globalPubSub } from 'src/pubsub-instance';
import { Context } from '@nestjs/graphql';

@InputType()
class emailEnableData {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  apiKey: string;
}

@Resolver()
export class OrganizationResolver {
  constructor(private organizationService: OrganizationService) {}

  @Query(() => OrganizationOutput)
  @UseGuards(AuthGuard, PermissionGuard)
  // @Permission(PERMISSIONS.ORG_VIEW)
  async findAll(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ) {
    const { totalCount, items } = await this.organizationService.findAll(
      skip,
      take,
    );
    return { totalCount, items };
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, PermissionGuard)
  // @Permission(PERMISSIONS.ORG_DELETE)
  async deleteOrganization(@Args('id') id: string) {
    const result = await this.organizationService.deleteOrganization(id);
    if (result) {
      // Publish the entire organization object because the client might query fields from it
      // though the client specifically asks for _id in the subscription
      await globalPubSub.publish('organizationDeleted', {
        organizationDeleted: result,
      });
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async emailEnable(
    @Args('data') data: emailEnableData,
    @Context() context: any,
  ) {
    const orgId = context.req.user.organizationId;
    const res = await this.organizationService.enableEmailService(data, orgId);
    console.log(res);
    if (res) return true;
    return false;
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async emailServiceStatus(@Context() context: any) {
    const orgId = context.req.user.organizationId;
    const res = await this.organizationService.emailServiceStatus(orgId);
    console.log(res);
    if (res) return true;
    return false;
  }
}
