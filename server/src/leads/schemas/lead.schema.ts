import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

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

  @Field(() => Int)
  @Prop({ required: true })
  budget: number; // Logic ke liye zaroori hai

  @Field()
  @Prop()
  serviceType: string;

  @Field()
  @Prop({
    default: 'NEW',
    enum: ['NEW', 'QUALIFIED', 'REJECTED', 'MEETING_BOOKED', 'WON', 'LOST'],
  })
  status: string;

  // Lead History: Har action yahan record hoga [cite: 24]
  @Field(() => [TimelineItem])
  @Prop({ type: [SchemaFactory.createForClass(TimelineItem)], default: [] })
  timeline: TimelineItem[];
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
