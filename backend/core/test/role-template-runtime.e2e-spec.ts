import { PrismaClient } from '@prisma/client';

import { PrismaService } from '../src/prisma/prisma.service';
import { AuthorizationService } from '../src/modules/auth/authorization.service';
import { RoleAssignmentService } from '../src/modules/auth/role-assignment.service';
import { RoleTemplateService } from '../src/modules/auth/role-template.service';

describe('Role Template Runtime Engine (E2E)', () => {
  jest.setTimeout(30000);

  const prisma = new PrismaClient();

  let roleTemplateService: RoleTemplateService;
  let roleAssignmentService: RoleAssignmentService;
  let authorizationService: AuthorizationService;

  beforeAll(async () => {
    await prisma.$connect();

    const prismaService = prisma as unknown as PrismaService;

    roleTemplateService = new RoleTemplateService(prismaService);
    roleAssignmentService = new RoleAssignmentService(prismaService);
    authorizationService = new AuthorizationService(prismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createPermission(
    resource: string,
    action: string,
  ) {
    return prisma.permission.create({
      data: {
        resource,
        action,
      },
    });
  }

  async function createTemplate(
    name: string,
    permissionIds: string[],
  ) {
    const template = await prisma.roleTemplate.create({
      data: {
        name,
        description: `${name} runtime test template`,
      },
    });

    for (const permissionId of permissionIds) {
      await prisma.roleTemplatePermission.create({
        data: {
          roleTemplateId: template.id,
          permissionId,
        },
      });
    }

    return template;
  }

  async function getRolePermissionKeys(roleId: string) {
    const rolePermissions =
      await prisma.rolePermission.findMany({
        where: {
          roleId,
        },
        include: {
          permission: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return rolePermissions.map(
      (rolePermission) =>
        `${rolePermission.permission.resource}.${rolePermission.permission.action}`,
    );
  }

  describe('Template Cloning', () => {
    it('should clone a role template into a real role successfully', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_clone_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Clone Template ${suffix}`,
        [permission.id],
      );

      const result =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Clone Role ${suffix}`,
        );

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.role).toBeDefined();
        expect(result.role?.name).toBe(
          `Runtime Clone Role ${suffix}`,
        );
      }
    });

    it('should create a role with permissions copied from the template', async () => {
      const suffix = Date.now();

      const permissionA = await createPermission(
        `runtime_copy_resource_a_${suffix}`,
        'read',
      );

      const permissionB = await createPermission(
        `runtime_copy_resource_b_${suffix}`,
        'update',
      );

      const template = await createTemplate(
        `Runtime Copy Template ${suffix}`,
        [permissionA.id, permissionB.id],
      );

      const result =
        await roleTemplateService.createRoleFromTemplate(
          template.id,
          `Runtime Copy Role ${suffix}`,
        );

      expect(result.success).toBe(true);

      if (!result.success || !result.role) {
        throw new Error('Role creation from template failed');
      }

      const rolePermissionKeys =
        await getRolePermissionKeys(result.role.id);

      expect(rolePermissionKeys).toContain(
        `runtime_copy_resource_a_${suffix}.read`,
      );

      expect(rolePermissionKeys).toContain(
        `runtime_copy_resource_b_${suffix}.update`,
      );

      expect(rolePermissionKeys.length).toBe(2);
    });

    it('should prevent cloning from an invalid role template', async () => {
      const result =
        await roleTemplateService.cloneTemplateToRole(
          '00000000-0000-0000-0000-000000000000',
          `Invalid Template Role ${Date.now()}`,
        );

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.errorCode).toBe(
          'ROLE_TEMPLATE_NOT_FOUND',
        );
      }
    });

    it('should prevent creating a role when the role name already exists', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_duplicate_role_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Duplicate Role Template ${suffix}`,
        [permission.id],
      );

      const roleName = `Runtime Duplicate Role ${suffix}`;

      const firstResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          roleName,
        );

      expect(firstResult.success).toBe(true);

      const secondResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          roleName,
        );

      expect(secondResult.success).toBe(false);

      if (!secondResult.success) {
        expect(secondResult.errorCode).toBe(
          'ROLE_ALREADY_EXISTS',
        );
      }
    });
  });

  describe('Template Isolation', () => {
    it('should keep the original template unchanged after cloning', async () => {
      const suffix = Date.now();

      const permissionA = await createPermission(
        `runtime_isolation_resource_a_${suffix}`,
        'read',
      );

      const permissionB = await createPermission(
        `runtime_isolation_resource_b_${suffix}`,
        'update',
      );

      const template = await createTemplate(
        `Runtime Isolation Template ${suffix}`,
        [permissionA.id],
      );

      const beforeResult =
        await roleTemplateService.getTemplatePermissions(
          template.id,
        );

      expect(beforeResult.success).toBe(true);

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Isolation Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const addResult =
        await roleTemplateService.addPermissionToRole(
          cloneResult.role.id,
          permissionB.id,
        );

      expect(addResult.success).toBe(true);

      const afterResult =
        await roleTemplateService.getTemplatePermissions(
          template.id,
        );

      expect(afterResult.success).toBe(true);

      if (beforeResult.success && afterResult.success) {
        const beforeKeys =
          beforeResult.permissions?.map(
            (permission) =>
              `${permission.resource}.${permission.action}`,
          ) ?? [];

        const afterKeys =
          afterResult.permissions?.map(
            (permission) =>
              `${permission.resource}.${permission.action}`,
          ) ?? [];

        expect(afterKeys).toEqual(beforeKeys);
        expect(afterKeys).not.toContain(
          `runtime_isolation_resource_b_${suffix}.update`,
        );
      }
    });
  });

  describe('Role Customization', () => {
    it('should add a permission to a cloned role', async () => {
      const suffix = Date.now();

      const permissionA = await createPermission(
        `runtime_add_resource_a_${suffix}`,
        'read',
      );

      const permissionB = await createPermission(
        `runtime_add_resource_b_${suffix}`,
        'create',
      );

      const template = await createTemplate(
        `Runtime Add Permission Template ${suffix}`,
        [permissionA.id],
      );

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Add Permission Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const addResult =
        await roleTemplateService.addPermissionToRole(
          cloneResult.role.id,
          permissionB.id,
        );

      expect(addResult.success).toBe(true);

      const permissionKeys =
        await getRolePermissionKeys(cloneResult.role.id);

      expect(permissionKeys).toContain(
        `runtime_add_resource_a_${suffix}.read`,
      );

      expect(permissionKeys).toContain(
        `runtime_add_resource_b_${suffix}.create`,
      );
    });

    it('should prevent adding a duplicate permission to a role', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_duplicate_permission_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Duplicate Permission Template ${suffix}`,
        [permission.id],
      );

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Duplicate Permission Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const duplicateResult =
        await roleTemplateService.addPermissionToRole(
          cloneResult.role.id,
          permission.id,
        );

      expect(duplicateResult.success).toBe(false);

      if (!duplicateResult.success) {
        expect(duplicateResult.errorCode).toBe(
          'ROLE_PERMISSION_ALREADY_EXISTS',
        );
      }
    });

    it('should remove a permission from a cloned role', async () => {
      const suffix = Date.now();

      const permissionA = await createPermission(
        `runtime_remove_resource_a_${suffix}`,
        'read',
      );

      const permissionB = await createPermission(
        `runtime_remove_resource_b_${suffix}`,
        'update',
      );

      const template = await createTemplate(
        `Runtime Remove Permission Template ${suffix}`,
        [permissionA.id, permissionB.id],
      );

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Remove Permission Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const removeResult =
        await roleTemplateService.removePermissionFromRole(
          cloneResult.role.id,
          permissionB.id,
        );

      expect(removeResult.success).toBe(true);

      const permissionKeys =
        await getRolePermissionKeys(cloneResult.role.id);

      expect(permissionKeys).toContain(
        `runtime_remove_resource_a_${suffix}.read`,
      );

      expect(permissionKeys).not.toContain(
        `runtime_remove_resource_b_${suffix}.update`,
      );
    });

    it('should reject removing a permission that is not assigned to the role', async () => {
      const suffix = Date.now();

      const permissionA = await createPermission(
        `runtime_missing_remove_resource_a_${suffix}`,
        'read',
      );

      const permissionB = await createPermission(
        `runtime_missing_remove_resource_b_${suffix}`,
        'delete',
      );

      const template = await createTemplate(
        `Runtime Missing Remove Template ${suffix}`,
        [permissionA.id],
      );

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Missing Remove Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const removeResult =
        await roleTemplateService.removePermissionFromRole(
          cloneResult.role.id,
          permissionB.id,
        );

      expect(removeResult.success).toBe(false);

      if (!removeResult.success) {
        expect(removeResult.errorCode).toBe(
          'ROLE_PERMISSION_NOT_FOUND',
        );
      }
    });
  });

  describe('Permission Retrieval', () => {
    it('should retrieve template permissions', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_template_permissions_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Template Permissions ${suffix}`,
        [permission.id],
      );

      const result =
        await roleTemplateService.getTemplatePermissions(
          template.id,
        );

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.permissions).toBeDefined();
        expect(result.permissions?.length).toBe(1);
        expect(result.permissions?.[0].resource).toBe(
          `runtime_template_permissions_resource_${suffix}`,
        );
        expect(result.permissions?.[0].action).toBe('read');
      }
    });

    it('should retrieve cloned role permissions', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_role_permissions_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Role Permissions Template ${suffix}`,
        [permission.id],
      );

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Role Permissions Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const result =
        await roleTemplateService.getRolePermissions(
          cloneResult.role.id,
        );

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.permissions).toBeDefined();
        expect(result.permissions?.length).toBe(1);
        expect(result.permissions?.[0].resource).toBe(
          `runtime_role_permissions_resource_${suffix}`,
        );
        expect(result.permissions?.[0].action).toBe('read');
      }
    });
  });

  describe('Authorization Integration', () => {
    it('should make cloned role permissions available after role assignment', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_authorization_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Authorization Template ${suffix}`,
        [permission.id],
      );

      const user = await prisma.user.create({
        data: {
          email: `runtime-auth-${suffix}@test.com`,
          password: 'password',
        },
      });

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Authorization Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      const assignmentResult =
        await roleAssignmentService.assignRole(
          null,
          user.id,
          cloneResult.role.id,
        );

      expect(assignmentResult.success).toBe(true);

      const hasPermission =
        await authorizationService.hasPermission(
          user.id,
          `runtime_authorization_resource_${suffix}`,
          'read',
        );

      expect(hasPermission).toBe(true);
    });

    it('should reflect permission removal after cloned role customization', async () => {
      const suffix = Date.now();

      const permission = await createPermission(
        `runtime_authorization_remove_resource_${suffix}`,
        'read',
      );

      const template = await createTemplate(
        `Runtime Authorization Remove Template ${suffix}`,
        [permission.id],
      );

      const user = await prisma.user.create({
        data: {
          email: `runtime-auth-remove-${suffix}@test.com`,
          password: 'password',
        },
      });

      const cloneResult =
        await roleTemplateService.cloneTemplateToRole(
          template.id,
          `Runtime Authorization Remove Role ${suffix}`,
        );

      expect(cloneResult.success).toBe(true);

      if (!cloneResult.success || !cloneResult.role) {
        throw new Error('Template cloning failed');
      }

      await roleAssignmentService.assignRole(
        null,
        user.id,
        cloneResult.role.id,
      );

      const hasPermissionBeforeRemoval =
        await authorizationService.hasPermission(
          user.id,
          `runtime_authorization_remove_resource_${suffix}`,
          'read',
        );

      expect(hasPermissionBeforeRemoval).toBe(true);

      const removeResult =
        await roleTemplateService.removePermissionFromRole(
          cloneResult.role.id,
          permission.id,
        );

      expect(removeResult.success).toBe(true);

      const hasPermissionAfterRemoval =
        await authorizationService.hasPermission(
          user.id,
          `runtime_authorization_remove_resource_${suffix}`,
          'read',
        );

      expect(hasPermissionAfterRemoval).toBe(false);
    });
  });
});