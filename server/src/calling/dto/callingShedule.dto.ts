import { InputType,Field } from "@nestjs/graphql";

@InputType()
export class CallingSheduleInput{
    @Field()
    leadId:string

    @Field()
    sheduleTime:Date
}