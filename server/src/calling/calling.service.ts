import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { OrganizationService } from 'src/organization/organization.service';
import { Calling } from './schemas/calling.schema';
import type { CallingType } from './schemas/calling.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Lead } from 'src/leads/schemas/lead.schema';



@Injectable()
export class CallingService {
    constructor(
        private organizationService: OrganizationService,
        @InjectModel(Calling.name) private callingModel: Model<CallingType>,
    ) { }

    async sheduleCall(orgId: string, data: { leadId: string, sheduleTime: Date }) {
        const org = await this.organizationService.findOne({ _id: new Types.ObjectId(orgId) })
        if (!org) throw new NotFoundException("Organization not found!!!")

        const vapiApiKey = org.vapiApiKey
        const vapiAssistantId = org.vapiAssistantId

        if (!vapiApiKey || !vapiAssistantId) throw new BadRequestException("Vapi Api Key and Assistant Id are required!!!")

        const callShedule = await this.callingModel.create({
            organizationId: orgId,
            leadId: new Types.ObjectId(data.leadId),
            sheduleTime: data.sheduleTime,
            status: 'PENDING'
        })
        return callShedule;

    }

    async getScheduledCalls(orgId: string, leadId?: string) {
        const filter: any = { organizationId: orgId };
        if (leadId) {
            filter.leadId = new Types.ObjectId(leadId);
        }
        return this.callingModel.find(filter).sort({ sheduleTime: 1 }).populate('leadId');
    }

    async deleteScheduledCall(id: string) {
        const result = await this.callingModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Scheduled call not found");
        return result;
    }

    async updateScheduledCall(id: string, sheduleTime: Date) {
        const result = await this.callingModel.findByIdAndUpdate(
            id,
            { sheduleTime },
            { new: true }
        ).populate('leadId');
        if (!result) throw new NotFoundException("Scheduled call not found");
        return result;
    }

    async makeVapicall(callData: any) {
        try {
            const { apiKey, assistantId, phoneNumberId, number } = callData;

            if (!apiKey) {
                throw new BadRequestException('VAPI API key is not configured in organization.');
            }
            if (!assistantId) {
                throw new BadRequestException('VAPI Assistant ID is not configured in organization.');
            }
            if (!phoneNumberId) {
                throw new BadRequestException('VAPI Phone Number ID is not configured in organization.');
            }
            if (!number) {
                throw new BadRequestException('Customer phone number is missing.');
            }

            const payload = {
                assistantId,
                phoneNumberId,
                customer: { number },
            }

            console.log('Vapi Payload:', JSON.stringify(payload, null, 2));

            const config = {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
            const response = await axios.post(`https://api.vapi.ai/call`, payload, config)
            return response.data;
        } catch (error) {
            console.error("Vapi Error:", error.response?.data || error.message)
            throw error
        }
    }

    @Cron('* * * * *')
    async CallCronJob() {
        const now = new Date();

        const BATCH_SIZE = 20;

        for (let i = 0; i < BATCH_SIZE; i++) {
            const call = await this.callingModel.findOneAndUpdate({
                sheduleTime: { $lte: now },
                status: 'PENDING'
            }, {
                $set: { status: 'PROGRESSING' }
            }, { new: true }).populate('leadId').populate('organizationId')

            if (!call) break;

            try {
                const org: any = call.organizationId
                const lead: any = call.leadId;

                if (!org || !lead) {
                    throw new Error("Org or lead data missing");
                }

                const vapiRes = await this.makeVapicall({
                    apiKey: org.vapiApiKey,
                    assistantId: org.vapiAssistantId,
                    phoneNumberId: org.vapiPhoneNumberId,
                    number: lead.phone,
                    internalId: call._id.toString(),
                    orgId: org._id.toString()
                })

                await this.callingModel.updateOne(
                    { _id: call._id },
                    {
                        $set: {
                            status: 'DONE',
                            vapiCallId: vapiRes.id
                        }
                    }
                )
            } catch (error) {
                console.error(`Failed to process call ${call._id}:`, error)
                await this.callingModel.updateOne(
                    { _id: call._id },
                    {
                        $set: {
                            status: 'FAILED'
                        }
                    }
                )
            }
        }
    }




}