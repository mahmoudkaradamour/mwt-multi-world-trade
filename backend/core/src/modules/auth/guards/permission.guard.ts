import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { AuthorizationService } from '../authorization.service';

import {
  PERMISSION_KEY,
  RequiredPermission,
} from '../decorators/require-permission.decorator';

/**
 * Permission Guard.
 *
 * Responsible for:
 * - Reading permission metadata
 * - Resolving user permissions
 * - Granting or denying access
 */
@Injectable()
export class PermissionGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,

    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermission =
      this.reflector.get<RequiredPermission>(
        PERMISSION_KEY,
        context.getHandler(),
      );

    /**
     * No permission requirement.
     *
     * Allow request.
     */
    if (!requiredPermission) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    /**
     * No authenticated user.
     */
    if (!user?.sub) {
      return false;
    }

    return this.authorizationService.hasPermission(
      user.sub,
      requiredPermission.resource,
      requiredPermission.action,
    );
  }
}