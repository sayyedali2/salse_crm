import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Roles } from '../../roles/schemas/role.schema';
import { Organization } from '../../organization/schemas/organization.schema';

export type UserDocument = User & Document;
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
}

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: 'number' })
  activeLeadsCount?: { type: Number; default: 0 };

  @Field(() => Boolean)
  @Prop({ type: 'boolean', default: true })
  isAssignable: Boolean;

  @Prop({ required: true })
  password: string;

  @Field(() => Organization)
  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organizationId: Types.ObjectId;

  @Field(() => Roles)
  @Prop({ type: Types.ObjectId, ref: 'Roles', required: true })
  role: Types.ObjectId;

  @Field()
  @Prop({ select: false })
  refreshToken?: string;

  @Field()
  @Prop({ default: UserStatus.ACTIVE, enum: UserStatus })
  status: string;

  @Field()
  @Prop({ required: true })
  phone: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: null })
  inviteToken?: string | null;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, default: null })
  ExpiryTempToken?: Date | null;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: null })
  TempToken?: string | null;

  @Field(() => String, { nullable: true })
  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
