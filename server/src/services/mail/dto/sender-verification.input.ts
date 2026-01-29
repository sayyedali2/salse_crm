import { InputType, Field } from "@nestjs/graphql";
import {IsEmail,IsNotEmpty, IsString} from 'class-validator'

@InputType()
export class SenderVerificationInput {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @Field()
    @IsString()
    @IsNotEmpty()
    name:string

}