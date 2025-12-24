import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLeadInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field(() => Int)
  budget: number;

  @Field()
  serviceType: string;
}
