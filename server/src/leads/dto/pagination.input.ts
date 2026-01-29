import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lead } from "../schemas/lead.schema";


@ObjectType()
export class PaginatedLeads {
  @Field(() => [Lead]) // Asli data (Leads ki list)
  items: Lead[];

  @Field(() => Int)    // Total records kitne hain database mein
  totalCount: number;
}