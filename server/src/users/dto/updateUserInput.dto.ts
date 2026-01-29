import { CreateUserInput } from "./createUserInput.dto";
import { InputType, Field, PartialType } from "@nestjs/graphql";
import { Types } from "mongoose";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput){}
