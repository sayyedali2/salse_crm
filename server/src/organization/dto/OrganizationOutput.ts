import { ObjectType, Field } from "@nestjs/graphql";
import { Organization } from "../schemas/organization.schema";

@ObjectType()
export class OrganizationOutput{
    @Field(()=>Number)
    totalCount: number
    @Field(()=>[Organization])
    items: Organization[]
}