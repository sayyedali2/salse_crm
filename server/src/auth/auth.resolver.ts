import {
  Resolver,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateOrganizationInput } from './dto/createOrganizationInput.dto';
import { Response, Request } from 'express';
import { SetupAccountInput } from './dto/setup-account.dto';
import { LoginInput } from './dto/loginInput.dto';
import { AuthGuard } from './auth.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { COOKIE_OPTIONS } from 'src/common/constants/cookieOptions';
import { ForgatPasswordInput } from './dto/forgatPasswordInput';
import { ResetPasswordInput } from './dto/resetPasswordInput';
import { User } from 'src/users/schemas/userSchema';
import { Types } from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { ForgotPasswordResponse } from './dto/forgot-password.response';
import { ResetPasswordResponse } from './dto/reset-password.response';
import { globalPubSub } from 'src/pubsub-instance';

// GraphQL Response Type (Token)
@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Subscription(() => AuthPayload)
  SetUpAccount() {
    return globalPubSub.asyncIterableIterator('SetUpAccount');
  }

  @Mutation(() => AuthPayload)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
    @Context() context: { res: Response },
  ) {
    const { refreshToken, accessToken, user, organization } =
      await this.authService.createOrganization(input);
    const res: Response = context.res;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return { accessToken, user };
  }

  @Mutation(() => User)
  async setupAccount(
    @Args('input') input: SetupAccountInput,
    @Context() context: { res: Response },
  ) {
    const res: Response = context.res;

    const { refreshToken, accessToken, user } =  await this.authService.setupAccount(input);

    globalPubSub.publish('SetUpAccount',{SetUpAccount:{refreshToken,accessToken,user}})
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return user;
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    const res: Response = context.res;
    const { refreshToken, accessToken, user } =
      await this.authService.login(input);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return { accessToken, user };
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard) // 🔒 Sirf logged-in user hi logout kar sakta hai
  async logout(
    @Context() context: { res: Response; req: Request & { user: User } }, // Req se user milega, Res se cookie clear hogi
  ) {
    const userId: string = context.req.user._id.toString();
    const res = context.res;

    // 1. Service Call (Database clean karo)
    await this.authService.logout(
      new Types.ObjectId(context.req.user._id),
      new Types.ObjectId(context.req.user.organizationId),
    );

    // 2. Cookies Clear karo (Browser clean karo)
    // Options wahi honi chahiye jo set karte waqt thi (path, secure, etc.)
    res.clearCookie('accessToken', COOKIE_OPTIONS);

    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    return true;
  }

  @Mutation(() => User)
  async UpdateExpireAccessToken(
    @Context() context: { req: any; res: Response },
  ) {
    const req = context.req;
    const res = context.res;
    const userID = req.user._id;
    const orgID = req.user.organizationId;
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) throw new ForbiddenException('No token found');
    const { refreshToken, accessToken, user } =
      await this.authService.UpdateExpireAccessToken(
        userID,
        orgID,
        oldRefreshToken,
      );
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return user;
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgatePassword(@Args('input') input: ForgatPasswordInput) {
    const res = await this.authService.forgotPassword(input);
    return { message: res };
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(@Args('input') input: ResetPasswordInput) {
    const res = await this.authService.resetPassword(input);
    return { message: res };
  }
}
