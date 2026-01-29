import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  phone?: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field(() => ID)
  role: Types.ObjectId;

  @Field(() => ID)
  organizationId: Types.ObjectId;
}
