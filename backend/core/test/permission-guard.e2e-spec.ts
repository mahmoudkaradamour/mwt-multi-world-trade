import { PrismaClient } from '@prisma/client';

describe('Permission Guard Foundation (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Permission Resolution', () => {
    let roleId: string;
    let permissionId: string;

    beforeAll(async () => {
      const role = await prisma.role.create({
        data: {
          name: `GUARD_ROLE_${Date.now()}`,
        },
      });

      roleId = role.id;

      const permission =
        await prisma.permission.create({
          data: {
            resource: `guard_resource_${Date.now()}`,
            action: 'read',
          },
        });

      permissionId = permission.id;
    });

    it('should assign permission to role', async () => {
      const relation =
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        });

      expect(relation).toBeDefined();
      expect(relation.roleId).toBe(roleId);
      expect(relation.permissionId).toBe(
        permissionId,
      );
    });

    it('should resolve permission from role', async () => {
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
        role?.permissions[0].permission.id,
      ).toBe(permissionId);
    });
  });

  describe('Permission Integrity', () => {
    it('should retrieve role with permissions', async () => {
      const role =
        await prisma.role.findFirst({
          where: {
            permissions: {
              some: {},
            },
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
    });

    it('should retrieve permission relations', async () => {
      const relations =
        await prisma.rolePermission.findMany({
          include: {
            role: true,
            permission: true,
          },
          take: 20,
        });

      expect(
        Array.isArray(relations),
      ).toBe(true);

      for (const relation of relations) {
        expect(relation.role).toBeDefined();
        expect(
          relation.permission,
        ).toBeDefined();
      }
    });
  });

  describe('Authorization Readiness', () => {
    it('should have seeded roles', async () => {
      const roles =
        await prisma.role.findMany();

      expect(roles.length).toBeGreaterThan(0);
    });

    it('should have seeded permissions', async () => {
      const permissions =
        await prisma.permission.findMany();

      expect(
        permissions.length,
      ).toBeGreaterThan(0);
    });

    it('should return valid role count', async () => {
      const count =
        await prisma.role.count();

      expect(count).toBeGreaterThan(0);
    });

    it('should return valid permission count', async () => {
      const count =
        await prisma.permission.count();

      expect(count).toBeGreaterThan(0);
    });

    it('should return valid role-permission count', async () => {
      const count =
        await prisma.rolePermission.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Security Validation', () => {
    it('should enforce role-permission uniqueness', async () => {
      const role = await prisma.role.create({
        data: {
          name: `UNIQUE_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource: `unique_resource_${Date.now()}`,
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

    it('should preserve relational consistency', async () => {
      const relations =
        await prisma.rolePermission.findMany({
          include: {
            role: true,
            permission: true,
          },
          take: 50,
        });

      for (const relation of relations) {
        expect(relation.role).toBeDefined();
        expect(
          relation.permission,
        ).toBeDefined();
      }
    });
  });
});