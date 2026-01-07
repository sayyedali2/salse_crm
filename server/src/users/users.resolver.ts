import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/createUserInput.dto';
import { CreateAdminUserInput } from './dto/createAdminUserInput.dto';
import { UserType } from 'src/auth/auth.resolver';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Context } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService,
  ) {}

  @Mutation(() => UserType)
  @UseGuards(AuthGuard)
  async CreateUser(@Args('input') input: CreateUserInput, @Context() context: any) {
    const req = context.req;
    if(req.user.role !=='Admin' && req.user.role !=='Owner') throw new BadRequestException('You are not authorized to create user');
    return this.usersService.createUser(input);
  }

  @Mutation(() => UserType)
  @UseGuards(AuthGuard)
  async CreateAdminUser(@Args('input') input: CreateAdminUserInput, @Context() context: any) {
    const req = context.req;
    const organizationId = req.user.organizationId;
    if(req.user.role !=='Admin' && req.user.role !=='Owner') throw new BadRequestException('You are not authorized to create user');
    return this.usersService.adminCreateUser(input, organizationId);
  }
}
