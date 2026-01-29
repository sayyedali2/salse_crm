import { Types } from "mongoose";
import { CreateRoleInput } from "./createRoleIntput.dto";
import { InputType,Field, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput){

    @Field(()=>ID)
    _id:Types.ObjectId;
}