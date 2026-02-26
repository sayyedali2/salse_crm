import { CreateUserInput } from "./createUserInput.dto";
import { InputType, Field, PartialType,Int } from "@nestjs/graphql";
import { Types } from "mongoose";
import { IsNumber, IsOptional } from "class-validator";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput){
    @Field(()=>Int,{nullable:true})
    @IsNumber()
    @IsOptional()
    activeLeadsCount?: number;
}
