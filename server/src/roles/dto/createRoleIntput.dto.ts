import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [String])
  @IsString({ each: true })
  @IsNotEmpty()
  permissions: string[];
}
