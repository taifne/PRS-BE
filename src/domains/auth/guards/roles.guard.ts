import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // 1. Get required roles metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // 3. Extract user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User does not have roles assigned');
    }

    // 4. Normalize role names to lowercase once
    const userRoles = Array.isArray(user.role)
      ? user.role.map(r => r.name.toLowerCase())
      : [user.role.name.toLowerCase()];

    const hasRole = requiredRoles.some(role => userRoles.includes(role.toLowerCase()));

    if (!hasRole) {
      // Optional: throw an error or just return false
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}