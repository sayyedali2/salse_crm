import {
  Resolver,
  Mutation,
  Args,
  Query,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/createUserInput.dto';
import { CreateAdminUserInput } from './dto/createAdminUserInput.dto';
import { User } from './schemas/userSchema';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUserInput.dto';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';
import { Permission } from 'src/common/decorator/permission/permission.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
import { PaginatedUsers } from './dto/pagination.input';
import { globalPubSub } from 'src/pubsub-instance';
import { DeleteUserOutput } from './dto/deleteUserOutput';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Subscription(() => User)
  userAdded() {
    return globalPubSub.asyncIterableIterator('userAdded');
  }
  @Subscription(() => User)
  userUpdated() {
    return globalPubSub.asyncIterableIterator('userUpdated');
  }

  @Subscription(() => String)
  userDeleted() {
    return globalPubSub.asyncIterableIterator('userDeleted');
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.USERS_CREATE)
  async createUser(@Args('input') input: CreateUserInput) {
    const user = await this.usersService.createUser(input);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.USERS_CREATE)
  async createAdminUser(
    @Args('input') input: CreateAdminUserInput,
    @Context() context: any,
  ) {
    const organizationId = context.req.user.organizationId;
    const user = await this.usersService.adminCreateUser(input, organizationId);
    await globalPubSub.publish('userAdded', { userAdded: user });
    console.log('user added', user);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Args('userId') targetUserId: string,
    @Context() context: any,
  ) {
    const currentUserRole = context.req.user.role;
    const currentUser = context.req.user;
    const organizationId = context.req.user.organizationId;

    const isAdmin = currentUserRole?.permissions?.includes(
      PERMISSIONS.USERS_EDIT,
    );
    const restrictedFields = ['email', 'organizationId', 'role', 'status'];

    if (!isAdmin) {
      if (currentUser._id.toString() !== targetUserId) {
        throw new ForbiddenException('You are not allowed to update this user');
      }

      const inputKeys = Object.keys(input);

      for (const key of inputKeys) {
        if (restrictedFields.includes(key))
          throw new ForbiddenException(
            `You are not allowed to update ${key} field`,
          );
      }
    }
    const user = await this.usersService.updateUser(
      input,
      organizationId,
      targetUserId,
    );
    const userToPublish: unknown = JSON.parse(JSON.stringify(user));
    await globalPubSub.publish('userUpdated', { userUpdated: userToPublish });
    console.log('user updated', user);
    return user;
  }

  @Mutation(() => DeleteUserOutput)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.USERS_DELETE)
  async deleteUser(@Args('userId') userId: string, @Context() context: any) {
    const organizationId = context.req.user.organizationId;
    const user = await this.usersService.deleteUser(userId, organizationId);
    await globalPubSub.publish('userDeleted', {
      userDeleted: user._id.toString(),
    });
    console.log('user deleted', user);
    return { message: 'User deleted successfully' };
  }

  @Query(() => PaginatedUsers)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.USERS_VIEW)
  async findAllUsers(
    @Context() context: any,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ) {
    const organizationId = context.req.user.organizationId;
    const { items, totalCount } = await this.usersService.findAllUsers(
      organizationId,
      skip,
      take,
    );
    return { items, totalCount };
  }

  @Query(() => User)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(PERMISSIONS.USERS_VIEW)
  async findUser(@Args('userId') userId: string, @Context() context: any) {
    const organizationId = context.req.user.organizationId;
    const user = await this.usersService.findOne({ userId, organizationId });
    return user;
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async findMe(@Context() context: any) {
    const organizationId = context.req.user.organizationId;
    const userId = context.req.user._id;
    const user = await this.usersService
      .findMe(userId, organizationId)
      .populate('role')
      .populate('organizationId');
    return user;
  }

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async searchUsers(@Args('search') search: string, @Context() context: any) {
    const orgId = context.req.user.organizationId;
    return this.usersService.findUsersBySearch(orgId, search);
  }
}
