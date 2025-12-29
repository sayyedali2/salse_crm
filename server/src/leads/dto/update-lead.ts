import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateLeadInput } from './create-lead.input';

@InputType()
export class UpdateLeadInput extends PartialType(CreateLeadInput) {
  @Field({ nullable: true })
  status?: string;
}
