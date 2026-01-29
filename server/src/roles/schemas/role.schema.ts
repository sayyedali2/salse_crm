import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type RolesDocument = Roles & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Roles {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field(() => [String])
  permissions: string[];

  @Prop({
    required: true,
    index: true,
    type: Types.ObjectId,
    ref: 'Organization',
  })
  @Field(() => ID)
  organizationID: Types.ObjectId;

  @Prop({ default: false })
  @Field()
  isSystemRole: Boolean;

  @Prop({ default: false })
  @Field()
  isDeleted: boolean;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
