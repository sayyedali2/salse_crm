import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

export type InquiryDocument = Inquiry & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Inquiry {
  @Field()
  _id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  companyName?: string;

  @Field()
  @Prop({ required: true })
  message: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
