import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types } from 'mongoose'
import { Lead } from "src/leads/schemas/lead.schema";

export enum CallStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROGRESSING',
    DONE = 'DONE'
}

export type CallingType = Calling & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Calling {
    @Field(() => ID)
    _id: string;

    @Field(() => String)
    @Prop({ required: true, type: Types.ObjectId, ref: 'Organization' })
    organizationId: Types.ObjectId

    @Field(() => Lead)
    @Prop({ required: true, type: Types.ObjectId, ref: 'Lead' })
    leadId: Types.ObjectId | Lead

    @Field(() => Date)
    @Prop({ required: true, type: Date })
    sheduleTime: Date

    @Field(() => String)
    @Prop({ default: CallStatus.PENDING, enum: CallStatus })
    status: string
}

export const callingSchema = SchemaFactory.createForClass(Calling)
callingSchema.index({ sheduleTime: 1 })
