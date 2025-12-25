import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { User } from '../users/user.schema'; // User type define karna padega agar error aaye

// GraphQL Response Type (Token)
@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
}

// User Type for GraphQL (create simple type here or separate file)
@ObjectType()
export class UserType {
  @Field()
  email: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('email') email: string, @Args('password') pass: string) {
    return this.authService.login(email, pass);
  }

  @Mutation(() => UserType)
  async signup(@Args('email') email: string, @Args('password') pass: string) {
    return this.authService.signup(email, pass);
  }
}
