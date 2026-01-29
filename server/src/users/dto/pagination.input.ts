import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../schemas/userSchema";


@ObjectType()
export class PaginatedUsers {
  @Field(() => [User]) // Asli data (Leads ki list)
  items: User[];

  @Field(() => Int)    // Total records kitne hain database mein
  totalCount: number;
}