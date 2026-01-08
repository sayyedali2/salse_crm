import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Booking {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  leadId: string; // Lead ka ID taaki connect kar sakein

  @Field()
  @Prop({ required: true })
  clientName: string; // Email ke liye zaroori hai

  @Field()
  @Prop({ required: true })
  clientEmail: string;

  @Field()
  @Prop({ required: true })
  date: Date; // Meeting ki Date

  @Field()
  @Prop({ required: true })
  timeSlot: string; // e.g., "10:00 AM"

  @Field()
  @Prop()
  meetingLink: string; // Google Meet Link

  @Field()
  @Prop({ default: 'SCHEDULED' })
  status: string; // SCHEDULED, COMPLETED, CANCELLED
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
