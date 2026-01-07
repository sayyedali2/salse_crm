import {InputType, Field, ObjectType} from "@nestjs/graphql";
import {IsEmail, IsString, IsNotEmpty} from "class-validator";


@InputType()
export class SetupAccountInput {
    @Field()
    @IsEmail()
    token: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
}

