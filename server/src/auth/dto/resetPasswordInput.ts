import { IsNotEmpty } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ResetPasswordInput {
    @Field()
    @IsNotEmpty()
    token: string;

    @Field()
    @IsNotEmpty()
    password: string;
}