import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class DeleteUserOutput {
  @Field()
  message: string;
}