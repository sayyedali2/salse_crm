import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInquiryInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  companyName?: string;

  @Field()
  message: string;
}
