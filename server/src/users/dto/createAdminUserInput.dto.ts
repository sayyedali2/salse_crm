import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateAdminUserInput {
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
  @IsOptional()
  phone: string;

  @Field(() => ID)
  role: Types.ObjectId;
} 
