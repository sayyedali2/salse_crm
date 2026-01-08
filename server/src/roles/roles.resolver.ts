import { Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from './schemas/role.schema';
import { CreateRoleInput } from './dto/createRoleIntput.dto';
import { Types } from 'mongoose';
import { UpdateRoleInput } from './dto/updateRoleinput.dto';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';
import { Permission } from 'src/common/decorator/permission/permission.decorator';


@Resolver()
export class RolesResolver {
  constructor(private roleService: RolesService) {}
  @Mutation(() => Roles)
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission('ROLES_MANAGE')
  async createRole(
    @Args('input') input: CreateRoleInput,
    @Context() context: { req: any },
  ) {
    const role = await this.roleService.createRole(
      input,
      new Types.ObjectId(context.req.user.organizationId),
    );
    return role;
  }

  @Mutation(() => Roles)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('ROLES_MANAGE')
  async deleteRole(
    @Args('roleID') input: String,
    @Context() context: { req: any },
  ) {
    const userRole = context.req.user.role;
    if (
      userRole?.isSystemRole !== true
    ) {
      throw new ForbiddenException('You are not authorized to delete role');
    }
    const role = await this.roleService.deleteRole(input, context.req.user.organizationId);
    return role;
  }

  @Mutation(() => Roles)
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('ROLES_MANAGE')
  async updateRole(
    @Args('input') input: UpdateRoleInput,
    @Context() context: { req: any },
  ) {
    const userRole = context.req.user.role;
    if (
      userRole?.isSystemRole !== true
    ) {
      throw new ForbiddenException('You are not authorized to update role');
    }
    const role = await this.roleService.updateRole(input, context.req.user.organizationId);
    return role;
  }

  @Query(() => [Roles])
  @UseGuards(AuthGuard,PermissionGuard)
  @Permission('ROLES_VIEW')
  async getRoles(@Context() context: { req: any }) {
    const roles = await this.roleService.getRoles(context.req.user.organizationId);

    if (roles.length === 0) {
      throw new NotFoundException('No roles found');
    }
    return roles;
  }
}
