import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

export type RolesDocument = Roles & Document;

@ObjectType()
@Schema({timestamps: true})
export class Roles {
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  permission: string[];

  @Prop({
    required: true,
    unique: true,
    type: Types.ObjectId,
    ref: 'Organization',
  })
  @Field()
  organizationID: Types.ObjectId;

  @Prop({ default: false })
  @Field()
  isDeleted: boolean;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
