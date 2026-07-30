import { PrismaClient } from '@prisma/client';

import { PrismaService } from '../src/prisma/prisma.service';
import { AuthorizationService } from '../src/modules/auth/authorization.service';
import { RoleAssignmentService } from '../src/modules/auth/role-assignment.service';

describe('Role Assignment Service (E2E)', () => {
  const prisma = new PrismaClient();

  let roleAssignmentService: RoleAssignmentService;
  let authorizationService: AuthorizationService;

  beforeAll(async () => {
    await prisma.$connect();

    const prismaService =
      prisma as unknown as PrismaService;

    roleAssignmentService =
      new RoleAssignmentService(prismaService);

    authorizationService =
      new AuthorizationService(prismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Role Assignment', () => {
    it('should assign a role to a user successfully', async () => {
      const user = await prisma.user.create({
        data: {
          email: `assign-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `ASSIGN_ROLE_${Date.now()}`,
        },
      });

      const result =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          role.id,
        );

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.userRole).toBeDefined();
        expect(result.userRole?.userId).toBe(user.id);
        expect(result.userRole?.roleId).toBe(role.id);
      }
    });

    it('should prevent duplicate role assignment', async () => {
      const user = await prisma.user.create({
        data: {
          email: `duplicate-assignment-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `DUPLICATE_ASSIGNMENT_ROLE_${Date.now()}`,
        },
      });

      const firstResult =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          role.id,
        );

      expect(firstResult.success).toBe(true);

      const secondResult =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          role.id,
        );

      expect(secondResult.success).toBe(false);

      if (!secondResult.success) {
        expect(secondResult.errorCode).toBe(
          'ROLE_ALREADY_ASSIGNED',
        );
      }
    });

    it('should reject assignment when user does not exist', async () => {
      const role = await prisma.role.create({
        data: {
          name: `MISSING_USER_ROLE_${Date.now()}`,
        },
      });

      const result =
        await roleAssignmentService.assignRole(
          null,
          '00000000-0000-0000-0000-000000000000',
          role.id,
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe('USER_NOT_FOUND');
      }
    });

    it('should reject assignment when role does not exist', async () => {
      const user = await prisma.user.create({
        data: {
          email: `missing-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const result =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          '00000000-0000-0000-0000-000000000000',
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe('ROLE_NOT_FOUND');
      }
    });
  });

  describe('Role Removal', () => {
    it('should remove an assigned role from a user successfully', async () => {
      const user = await prisma.user.create({
        data: {
          email: `remove-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `REMOVE_ROLE_${Date.now()}`,
        },
      });

      const assignmentResult =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          role.id,
        );

      expect(assignmentResult.success).toBe(true);

      const removalResult =
        await roleAssignmentService.removeRole(
          null,
          user.id,
          role.id,
        );

      expect(removalResult.success).toBe(true);

      const existingAssignment =
        await prisma.userRole.findUnique({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: role.id,
            },
          },
        });

      expect(existingAssignment).toBeNull();
    });

    it('should reject removal when assignment does not exist', async () => {
      const user = await prisma.user.create({
        data: {
          email: `missing-assignment-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `MISSING_ASSIGNMENT_ROLE_${Date.now()}`,
        },
      });

      const result =
        await roleAssignmentService.removeRole(
          null,
          user.id,
          role.id,
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe(
          'ROLE_ASSIGNMENT_NOT_FOUND',
        );
      }
    });

    it('should reject removal when user does not exist', async () => {
      const role = await prisma.role.create({
        data: {
          name: `REMOVE_MISSING_USER_ROLE_${Date.now()}`,
        },
      });

      const result =
        await roleAssignmentService.removeRole(
          null,
          '00000000-0000-0000-0000-000000000000',
          role.id,
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe('USER_NOT_FOUND');
      }
    });

    it('should reject removal when role does not exist', async () => {
      const user = await prisma.user.create({
        data: {
          email: `remove-missing-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const result =
        await roleAssignmentService.removeRole(
          null,
          user.id,
          '00000000-0000-0000-0000-000000000000',
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe('ROLE_NOT_FOUND');
      }
    });
  });

  describe('User Role Listing', () => {
    it('should list assigned roles for a user', async () => {
      const user = await prisma.user.create({
        data: {
          email: `list-roles-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const roleA = await prisma.role.create({
        data: {
          name: `LIST_ROLE_A_${Date.now()}`,
        },
      });

      const roleB = await prisma.role.create({
        data: {
          name: `LIST_ROLE_B_${Date.now()}`,
        },
      });

      await roleAssignmentService.assignRole(
        null,
        user.id,
        roleA.id,
      );

      await roleAssignmentService.assignRole(
        null,
        user.id,
        roleB.id,
      );

      const result =
        await roleAssignmentService.getUserRoles(user.id);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.roles).toBeDefined();
        expect(result.roles?.length).toBe(2);

        const roleNames =
          result.roles?.map((role) => role.name) ?? [];

        expect(roleNames).toContain(roleA.name);
        expect(roleNames).toContain(roleB.name);
      }
    });

    it('should reject listing roles for missing user', async () => {
      const result =
        await roleAssignmentService.getUserRoles(
          '00000000-0000-0000-0000-000000000000',
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe('USER_NOT_FOUND');
      }
    });
  });

  describe('Assignment Validation', () => {
    it('should validate a valid role assignment', async () => {
      const user = await prisma.user.create({
        data: {
          email: `valid-assignment-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `VALID_ASSIGNMENT_ROLE_${Date.now()}`,
        },
      });

      const result =
        await roleAssignmentService.validateAssignment(
          user.id,
          role.id,
        );

      expect(result.success).toBe(true);
    });

    it('should reject validation when assignment already exists', async () => {
      const user = await prisma.user.create({
        data: {
          email: `existing-validation-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `EXISTING_VALIDATION_ROLE_${Date.now()}`,
        },
      });

      await roleAssignmentService.assignRole(
        null,
        user.id,
        role.id,
      );

      const result =
        await roleAssignmentService.validateAssignment(
          user.id,
          role.id,
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe(
          'ROLE_ALREADY_ASSIGNED',
        );
      }
    });
  });

  describe('Authorization Integration Readiness', () => {
    it('should make assigned role permissions available through AuthorizationService', async () => {
      const resource =
        `role_assignment_resource_${Date.now()}`;

      const user = await prisma.user.create({
        data: {
          email: `assignment-permission-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `ASSIGNMENT_PERMISSION_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource,
            action: 'read',
          },
        });

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      const assignmentResult =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          role.id,
        );

      expect(assignmentResult.success).toBe(true);

      const hasPermission =
        await authorizationService.hasPermission(
          user.id,
          resource,
          'read',
        );

      expect(hasPermission).toBe(true);
    });

    it('should remove permission access after role removal', async () => {
      const resource =
        `role_removal_resource_${Date.now()}`;

      const user = await prisma.user.create({
        data: {
          email: `removal-permission-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `REMOVAL_PERMISSION_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource,
            action: 'read',
          },
        });

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      await roleAssignmentService.assignRole(
        null,
        user.id,
        role.id,
      );

      const hasPermissionBeforeRemoval =
        await authorizationService.hasPermission(
          user.id,
          resource,
          'read',
        );

      expect(hasPermissionBeforeRemoval).toBe(true);

      await roleAssignmentService.removeRole(
        null,
        user.id,
        role.id,
      );

      const hasPermissionAfterRemoval =
        await authorizationService.hasPermission(
          user.id,
          resource,
          'read',
        );

      expect(hasPermissionAfterRemoval).toBe(false);
    });
  });
});