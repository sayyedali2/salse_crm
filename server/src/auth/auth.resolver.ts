import {
  Resolver,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateOrganizationInput } from './dto/createOrganizationInput.dto';
import { Response } from 'express';
import { SetupAccountInput } from './dto/setup-account.dto';
import { LoginInput } from './dto/loginInput.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { COOKIE_OPTIONS } from 'src/common/constants/cookieOptions';

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

  @Mutation(() => UserType)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
    @Context() context: { res: Response },
  ) {
    const { refreshToken, accessToken, user } =
      await this.authService.createOrganization(input);
    const res: Response = context.res;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return user;
  }

  @Mutation(() => UserType)
  async setupAccount(
    @Args('input') input: SetupAccountInput,
    @Context() context: { res: Response },
  ) {
    const res: Response = context.res;

    const { refreshToken, accessToken, user } =
      await this.authService.setupAccount(input);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return user;
  }

  @Mutation(() => UserType)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    const res: Response = context.res;
    const { refreshToken, accessToken, user } =
      await this.authService.login(input);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard) // 🔒 Sirf logged-in user hi logout kar sakta hai
  async logout(
    @Context() context: { res: Response; req: any }, // Req se user milega, Res se cookie clear hogi
  ) {
    const userId = context.req.user._id;
    const res = context.res;

    // 1. Service Call (Database clean karo)
    await this.authService.logout(userId, context.req.user.organizationId);

    // 2. Cookies Clear karo (Browser clean karo)
    // Options wahi honi chahiye jo set karte waqt thi (path, secure, etc.)
    res.clearCookie('accessToken', COOKIE_OPTIONS);

    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    return true;
  }
}
