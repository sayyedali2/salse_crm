import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetPasswordResponse {
  @Field()
  message: string;
}
