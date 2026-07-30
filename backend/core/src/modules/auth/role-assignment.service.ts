import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

type RoleAssignmentErrorCode =
  | 'USER_NOT_FOUND'
  | 'ROLE_NOT_FOUND'
  | 'ROLE_ALREADY_ASSIGNED'
  | 'ROLE_ASSIGNMENT_NOT_FOUND'
  | 'ROLE_ASSIGNMENT_FAILED'
  | 'ROLE_REMOVAL_FAILED';

type RoleAssignmentUserRole = {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
};

type RoleAssignmentRole = {
  assignmentId: string;
  roleId: string;
  name: string;
  assignedAt: Date;
};

type RoleAssignmentSuccess = {
  success: true;
  message: string;
  userRole?: RoleAssignmentUserRole;
  roles?: RoleAssignmentRole[];
};

type RoleAssignmentError = {
  success: false;
  errorCode: RoleAssignmentErrorCode;
  message: string;
};

export type RoleAssignmentResult =
  | RoleAssignmentSuccess
  | RoleAssignmentError;

@Injectable()
export class RoleAssignmentService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async assignRole(
    actorId: string | null,
    targetUserId: string,
    roleId: string,
  ): Promise<RoleAssignmentResult> {
    void actorId;

    const validation =
      await this.validateAssignment(
        targetUserId,
        roleId,
      );

    if (!validation.success) {
      return validation;
    }

    try {
      const userRole =
        await this.prisma.userRole.create({
          data: {
            userId: targetUserId,
            roleId,
          },
        });

      return {
        success: true,
        message: 'Role assigned successfully',
        userRole,
      };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return {
          success: false,
          errorCode: 'ROLE_ALREADY_ASSIGNED',
          message:
            'Role is already assigned to this user',
        };
      }

      return {
        success: false,
        errorCode: 'ROLE_ASSIGNMENT_FAILED',
        message: 'Role assignment failed',
      };
    }
  }

  async removeRole(
    actorId: string | null,
    targetUserId: string,
    roleId: string,
  ): Promise<RoleAssignmentResult> {
    void actorId;

    const user = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!user) {
      return {
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }

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

    const assignment =
      await this.prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: targetUserId,
            roleId,
          },
        },
      });

    if (!assignment) {
      return {
        success: false,
        errorCode: 'ROLE_ASSIGNMENT_NOT_FOUND',
        message: 'Role assignment not found',
      };
    }

    try {
      const removedAssignment =
        await this.prisma.userRole.delete({
          where: {
            id: assignment.id,
          },
        });

      return {
        success: true,
        message: 'Role removed successfully',
        userRole: removedAssignment,
      };
    } catch {
      return {
        success: false,
        errorCode: 'ROLE_REMOVAL_FAILED',
        message: 'Role removal failed',
      };
    }
  }

  async getUserRoles(
    userId: string,
  ): Promise<RoleAssignmentResult> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }

    const userRoles =
      await this.prisma.userRole.findMany({
        where: {
          userId,
        },
        include: {
          role: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return {
      success: true,
      message: 'User roles retrieved successfully',
      roles: userRoles.map((userRole) => ({
        assignmentId: userRole.id,
        roleId: userRole.role.id,
        name: userRole.role.name,
        assignedAt: userRole.createdAt,
      })),
    };
  }

  async validateAssignment(
    targetUserId: string,
    roleId: string,
  ): Promise<RoleAssignmentResult> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!user) {
      return {
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }

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

    const assignment =
      await this.prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: targetUserId,
            roleId,
          },
        },
      });

    if (assignment) {
      return {
        success: false,
        errorCode: 'ROLE_ALREADY_ASSIGNED',
        message:
          'Role is already assigned to this user',
      };
    }

    return {
      success: true,
      message: 'Role assignment is valid',
    };
  }

  private isUniqueConstraintError(
    error: unknown,
  ): boolean {
    return (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}