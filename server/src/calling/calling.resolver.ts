import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { CallingService } from './calling.service'
import { Calling } from './schemas/calling.schema'
import { CallingSheduleInput } from './dto/callingShedule.dto'
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(AuthGuard)
export class CallingResolver {
    constructor(private callingService: CallingService) { }

    @Mutation(() => Calling)
    async sheduleCall(@Args('data') data: CallingSheduleInput, @Context() context: any) {
        try {
            const orgId = context.req.user.organizationId;
            console.log("Scheduling call for org:", orgId, "data:", data);
            return await this.callingService.sheduleCall(orgId, data);
        } catch (error) {
            console.error("Error in sheduleCall:", error);
            throw error;
        }
    }

    @Query(() => [Calling])
    async getScheduledCalls(
        @Context() context: any,
        @Args('leadId', { nullable: true }) leadId?: string
    ) {
        try {
            const orgId = context.req.user.organizationId;
            console.log("Getting scheduled calls for org:", orgId, "leadId:", leadId);
            return await this.callingService.getScheduledCalls(orgId, leadId);
        } catch (error) {
            console.error("Error in getScheduledCalls:", error);
            throw error;
        }
    }

    @Mutation(() => Calling)
    async deleteScheduledCall(@Args('id') id: string) {
        return this.callingService.deleteScheduledCall(id);
    }

    @Mutation(() => Calling)
    async updateScheduledCall(
        @Args('id') id: string,
        @Args('sheduleTime') sheduleTime: Date
    ) {
        return this.callingService.updateScheduledCall(id, sheduleTime);
    }
}
