import { InputType , Field} from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export class ForgatPasswordInput {
    @Field()
    @IsEmail()
    email:string;
}