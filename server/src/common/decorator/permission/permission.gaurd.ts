import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) return true;
    const req = GqlExecutionContext.create(context).getContext().req;
    const user = req.user;
    const hasPermission = permissions.some((p) =>
      user?.role?.permissions?.includes(p),
    );
    return hasPermission;
  }
}
