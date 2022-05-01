import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions0 = this.reflector.get<string[]>(
      'permissions',
      context.getClass(),
    );
    const routePermissions1 = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const userPermissions = context.getArgs()[0].user.permissions;

    if (!routePermissions0 && !routePermissions1) {
      return false;
    }

    const hasPermission0 = () =>
      !!routePermissions0 &&
      routePermissions0.every((routePermission) =>
        userPermissions.includes(routePermission),
      );
    const hasPermission1 = () =>
      !!routePermissions1 &&
      routePermissions1.every((routePermission) =>
        userPermissions.includes(routePermission),
      );

    return hasPermission0() || hasPermission1();
  }
}
