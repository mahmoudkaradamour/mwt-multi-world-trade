import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

interface PermissionCheck {
  resource: string;
  action: string;
}

/**
 * Authorization service.
 *
 * Responsible for:
 * - Permission resolution
 * - Permission evaluation
 * - Authorization checks
 */
@Injectable()
export class AuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get all effective permissions for a user.
   */
  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) {
      return [];
    }

    return user.role.permissions.map(
      (rolePermission) => ({
        resource:
          rolePermission.permission.resource,
        action:
          rolePermission.permission.action,
      }),
    );
  }

  /**
   * Check whether a user has a specific permission.
   */
  async hasPermission(
    userId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const permissions =
      await this.getUserPermissions(userId);

    return permissions.some(
      (permission) =>
        permission.resource === resource &&
        permission.action === action,
    );
  }

  /**
   * Check whether a user has at least one permission
   * from the provided list.
   */
  async hasAnyPermission(
    userId: string,
    requiredPermissions: PermissionCheck[],
  ): Promise<boolean> {
    const permissions =
      await this.getUserPermissions(userId);

    return requiredPermissions.some(
      (requiredPermission) =>
        permissions.some(
          (permission) =>
            permission.resource ===
              requiredPermission.resource &&
            permission.action ===
              requiredPermission.action,
        ),
    );
  }

  /**
   * Check whether a user has all permissions
   * from the provided list.
   */
  async hasAllPermissions(
    userId: string,
    requiredPermissions: PermissionCheck[],
  ): Promise<boolean> {
    const permissions =
      await this.getUserPermissions(userId);

    return requiredPermissions.every(
      (requiredPermission) =>
        permissions.some(
          (permission) =>
            permission.resource ===
              requiredPermission.resource &&
            permission.action ===
              requiredPermission.action,
        ),
    );
  }
}