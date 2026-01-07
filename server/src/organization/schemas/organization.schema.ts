import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

export type OrganizationDocument = Organizaiton & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Organizaiton {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  domain: string;

  @Prop()
  @Field({ nullable: true })
  logoUrl?: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true, unique: true })
  @Field()
  ownerName: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organizaiton);
