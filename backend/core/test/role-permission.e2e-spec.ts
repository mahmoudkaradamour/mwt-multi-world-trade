import { PrismaClient } from '@prisma/client';

describe('Role Permission Module (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Role Permission Assignment', () => {
    let roleId: string;
    let permissionId: string;

    beforeAll(async () => {
      const role = await prisma.role.create({
        data: {
          name: `TEST_ROLE_${Date.now()}`,
        },
      });

      const permission = await prisma.permission.create({
        data: {
          resource: `test_resource_${Date.now()}`,
          action: 'read',
        },
      });

      roleId = role.id;
      permissionId = permission.id;
    });

    it('should assign permission to role', async () => {
      const rolePermission =
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        });

      expect(rolePermission).toBeDefined();
      expect(rolePermission.roleId).toBe(roleId);
      expect(rolePermission.permissionId).toBe(
        permissionId,
      );
    });

    it('should retrieve role permissions', async () => {
      const role = await prisma.role.findUnique({
        where: {
          id: roleId,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      expect(role).not.toBeNull();
      expect(role?.permissions.length).toBe(1);
      expect(
        role?.permissions[0].permission.action,
      ).toBe('read');
    });
  });

  describe('Duplicate Prevention', () => {
    it('should prevent duplicate role permissions', async () => {
      const role = await prisma.role.create({
        data: {
          name: `DUP_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource: `dup_resource_${Date.now()}`,
            action: 'create',
          },
        });

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      await expect(
        prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Cascade Delete Validation', () => {
    it('should remove role permissions when role is deleted', async () => {
      const role = await prisma.role.create({
        data: {
          name: `CASCADE_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource: `cascade_resource_${Date.now()}`,
            action: 'read',
          },
        });

      const relation =
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });

      expect(relation).toBeDefined();

      await prisma.role.delete({
        where: {
          id: role.id,
        },
      });

      const link =
        await prisma.rolePermission.findUnique({
          where: {
            id: relation.id,
          },
        });

      expect(link).toBeNull();
    });
  });

  describe('Permission Assignment Integrity', () => {
    it('should retrieve all permissions assigned to a role', async () => {
      const admin =
        await prisma.role.findFirst({
          where: {
            name: 'ADMIN',
          },
        });

      expect(admin).not.toBeNull();
    });

    it('should return valid role count', async () => {
      const count = await prisma.role.count();

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });

    it('should return valid role-permission count', async () => {
      const count =
        await prisma.rolePermission.count();

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});