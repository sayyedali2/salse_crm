import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/schemas/userSchema';

export type LeadDocument = Lead & Document;

// Timeline logs ke liye sub-schema
@ObjectType()
@Schema()
export class TimelineItem {
  @Field()
  @Prop()
  event: string; // e.g., "Email Sent", "Meeting Booked"

  @Field()
  @Prop({ default: Date.now })
  timestamp: Date;
}

@ObjectType()
@Schema({ timestamps: true })
export class Lead {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true }) // Spam Protection (Unique Email) [cite: 16]
  email: string;

  @Field()
  @Prop({ required: true })
  phone: string;

  @Field(() => ID)
  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organizationId: Types.ObjectId;

  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo?: User;

  @Field()
  @Prop({ default: 'Website' })
  source: string; // 'Website', 'Excel', 'Email', 'Manual'

  @Field(() => Int)
  @Prop({ required: true })
  budget: number; // Logic ke liye zaroori hai

  @Field()
  @Prop()
  serviceType: string;

  @Prop()
  aiSummary?: string;

  @Prop()
  qualityScore?: number;

  @Field()
  @Prop({
    default: 'NEW',

    enum: [
      'NEW',
      'QUALIFIED',
      'REJECTED',
      'MEETING_BOOKED',
      'WON',
      'LOST',
      'PROPOSAL_SENT',
    ],
  })
  status: string;

  // Lead History: Har action yahan record hoga [cite: 24]
  @Field(() => [TimelineItem])
  @Prop({ type: [SchemaFactory.createForClass(TimelineItem)], default: [] })
  timeline: TimelineItem[];
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.index({ organizationId: 1, status: 1, email: 1 }, { unique: true }); // Pipeline view ke liye fast
LeadSchema.index({ assignedTo: 1 }); // "My Leads" view ke liye fast
