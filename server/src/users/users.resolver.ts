import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/createUserInput.dto';
import { CreateAdminUserInput } from './dto/createAdminUserInput.dto';
import { UserType } from 'src/auth/auth.resolver';
import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUserInput.dto';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';
import { Permission } from 'src/common/decorator/permission/permission.decorator';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserType)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('USERS_CREATE')
  async createUser(
    @Args('input') input: CreateUserInput,
  ) {
    const user = await this.usersService.createUser(input);
    return user;
  }

  @Mutation(() => UserType)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('USERS_CREATE')
  async createAdminUser(
    @Args('input') input: CreateAdminUserInput,
    @Context() context: any,
  ) {
    const organizationId = context.req.user.organizationId;
      const user= await this.usersService.adminCreateUser(input, organizationId);
      return user;
  }

  @Mutation(() => UserType)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('USERS_EDIT')
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Context() context: any,
  ) {
    const organizationId = context.req.user.organizationId;
    const user = await this.usersService.updateUser(input, organizationId);
    return user;
  }

  @Mutation(() => UserType)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('USERS_DELETE')
  async deleteUser(
    @Args('userId') userId: string,
    @Context() context: any,
  ) {
    const organizationId = context.req.user.organizationId;
    const user = await this.usersService.deleteUser(userId, organizationId);
    return user;
  }

  @Query(() => [UserType])
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('USERS_VIEW')
  async findAllUsers(
    @Context() context: any,
  ) {
    const organizationId = context.req.user.organizationId;
    const users = await this.usersService.findAllUsers(organizationId);
    return users;
  }
}
