import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  leadId: string;

  @Field()
  date: Date;

  @Field()
  timeSlot: string;
}
