import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

type RoleTemplateRuntimeErrorCode =
  | 'ROLE_TEMPLATE_NOT_FOUND'
  | 'ROLE_ALREADY_EXISTS'
  | 'ROLE_NOT_FOUND'
  | 'PERMISSION_NOT_FOUND'
  | 'ROLE_PERMISSION_ALREADY_EXISTS'
  | 'ROLE_PERMISSION_NOT_FOUND'
  | 'ROLE_TEMPLATE_CLONE_FAILED'
  | 'ROLE_PERMISSION_ASSIGNMENT_FAILED'
  | 'ROLE_PERMISSION_REMOVAL_FAILED';

type RoleTemplateRuntimeRole = {
  id: string;
  name: string;
  createdAt: Date;
};

type RoleTemplateRuntimePermission = {
  id: string;
  resource: string;
  action: string;
};

type RoleTemplateRuntimeRolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
};

type RoleTemplateRuntimeSuccess = {
  success: true;
  message: string;
  role?: RoleTemplateRuntimeRole;
  permission?: RoleTemplateRuntimePermission;
  permissions?: RoleTemplateRuntimePermission[];
  rolePermission?: RoleTemplateRuntimeRolePermission;
};

type RoleTemplateRuntimeError = {
  success: false;
  errorCode: RoleTemplateRuntimeErrorCode;
  message: string;
};

export type RoleTemplateRuntimeResult =
  | RoleTemplateRuntimeSuccess
  | RoleTemplateRuntimeError;

@Injectable()
export class RoleTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async cloneTemplateToRole(
    templateId: string,
    roleName: string,
  ): Promise<RoleTemplateRuntimeResult> {
    const template = await this.prisma.roleTemplate.findUnique({
      where: {
        id: templateId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!template) {
      return {
        success: false,
        errorCode: 'ROLE_TEMPLATE_NOT_FOUND',
        message: 'Role template not found',
      };
    }

    const existingRole = await this.prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (existingRole) {
      return {
        success: false,
        errorCode: 'ROLE_ALREADY_EXISTS',
        message: 'Role already exists',
      };
    }

    try {
      const role = await this.prisma.$transaction(async (tx) => {
        const createdRole = await tx.role.create({
          data: {
            name: roleName,
          },
        });

        for (const templatePermission of template.permissions) {
          await tx.rolePermission.create({
            data: {
              roleId: createdRole.id,
              permissionId: templatePermission.permissionId,
            },
          });
        }

        return createdRole;
      });

      return {
        success: true,
        message: 'Role created from template successfully',
        role,
      };
    } catch {
      return {
        success: false,
        errorCode: 'ROLE_TEMPLATE_CLONE_FAILED',
        message: 'Role template cloning failed',
      };
    }
  }

  async createRoleFromTemplate(
    templateId: string,
    roleName: string,
  ): Promise<RoleTemplateRuntimeResult> {
    return this.cloneTemplateToRole(templateId, roleName);
  }

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleTemplateRuntimeResult> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      return {
        success: false,
        errorCode: 'ROLE_NOT_FOUND',
        message: 'Role not found',
      };
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        id: permissionId,
      },
    });

    if (!permission) {
      return {
        success: false,
        errorCode: 'PERMISSION_NOT_FOUND',
        message: 'Permission not found',
      };
    }

    const existingRolePermission =
      await this.prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

    if (existingRolePermission) {
      return {
        success: false,
        errorCode: 'ROLE_PERMISSION_ALREADY_EXISTS',
        message: 'Permission is already assigned to this role',
      };
    }

    try {
      const rolePermission = await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      });

      return {
        success: true,
        message: 'Permission added to role successfully',
        rolePermission,
      };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return {
          success: false,
          errorCode: 'ROLE_PERMISSION_ALREADY_EXISTS',
          message: 'Permission is already assigned to this role',
        };
      }

      return {
        success: false,
        errorCode: 'ROLE_PERMISSION_ASSIGNMENT_FAILED',
        message: 'Permission assignment failed',
      };
    }
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleTemplateRuntimeResult> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      return {
        success: false,
        errorCode: 'ROLE_NOT_FOUND',
        message: 'Role not found',
      };
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        id: permissionId,
      },
    });

    if (!permission) {
      return {
        success: false,
        errorCode: 'PERMISSION_NOT_FOUND',
        message: 'Permission not found',
      };
    }

    const rolePermission = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (!rolePermission) {
      return {
        success: false,
        errorCode: 'ROLE_PERMISSION_NOT_FOUND',
        message: 'Role permission assignment not found',
      };
    }

    try {
      const removedRolePermission =
        await this.prisma.rolePermission.delete({
          where: {
            id: rolePermission.id,
          },
        });

      return {
        success: true,
        message: 'Permission removed from role successfully',
        rolePermission: removedRolePermission,
      };
    } catch {
      return {
        success: false,
        errorCode: 'ROLE_PERMISSION_REMOVAL_FAILED',
        message: 'Permission removal failed',
      };
    }
  }

  async getTemplatePermissions(
    templateId: string,
  ): Promise<RoleTemplateRuntimeResult> {
    const template = await this.prisma.roleTemplate.findUnique({
      where: {
        id: templateId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!template) {
      return {
        success: false,
        errorCode: 'ROLE_TEMPLATE_NOT_FOUND',
        message: 'Role template not found',
      };
    }

    return {
      success: true,
      message: 'Template permissions retrieved successfully',
      permissions: template.permissions.map((templatePermission) => ({
        id: templatePermission.permission.id,
        resource: templatePermission.permission.resource,
        action: templatePermission.permission.action,
      })),
    };
  }

  async getRolePermissions(
    roleId: string,
  ): Promise<RoleTemplateRuntimeResult> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!role) {
      return {
        success: false,
        errorCode: 'ROLE_NOT_FOUND',
        message: 'Role not found',
      };
    }

    return {
      success: true,
      message: 'Role permissions retrieved successfully',
      permissions: role.permissions.map((rolePermission) => ({
        id: rolePermission.permission.id,
        resource: rolePermission.permission.resource,
        action: rolePermission.permission.action,
      })),
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}