import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
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

  @Prop({ required: true })
  password: string;

  @Field(() => ID)
  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organizationId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
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

  @Field()
  @Prop({ default: null })
  inviteToken?: string | null;

  @Field()
  @Prop({ default: null })
  ExpiryTempToken?: Date | null;

  @Field()
  @Prop({ default: null })
  TempToken?: string | null;

  @Field()
  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ organizationId: 1 });
