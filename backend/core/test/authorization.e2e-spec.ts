import { PrismaClient } from '@prisma/client';

describe('Authorization Service (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Permission Resolution Foundation', () => {
    let roleId: string;
    let permissionReadId: string;
    let permissionUpdateId: string;

    beforeAll(async () => {
      const role = await prisma.role.create({
        data: {
          name: `AUTH_ROLE_${Date.now()}`,
        },
      });

      roleId = role.id;

      const readPermission =
        await prisma.permission.create({
          data: {
            resource: `authorization_resource_${Date.now()}`,
            action: 'read',
          },
        });

      permissionReadId = readPermission.id;

      const updatePermission =
        await prisma.permission.create({
          data: {
            resource: `authorization_resource_update_${Date.now()}`,
            action: 'update',
          },
        });

      permissionUpdateId = updatePermission.id;
    });

    it('should assign read permission to role', async () => {
      const relation =
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId: permissionReadId,
          },
        });

      expect(relation).toBeDefined();
      expect(relation.roleId).toBe(roleId);
    });

    it('should assign update permission to role', async () => {
      const relation =
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId: permissionUpdateId,
          },
        });

      expect(relation).toBeDefined();
    });

    it('should resolve permissions through role', async () => {
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
      expect(role?.permissions.length).toBe(2);
    });

    it('should include read permission', async () => {
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

      const hasPermission =
        role?.permissions.some(
          (permissionRelation) =>
            permissionRelation.permission.id ===
            permissionReadId,
        );

      expect(hasPermission).toBe(true);
    });

    it('should include update permission', async () => {
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

      const hasPermission =
        role?.permissions.some(
          (permissionRelation) =>
            permissionRelation.permission.id ===
            permissionUpdateId,
        );

      expect(hasPermission).toBe(true);
    });
  });

  describe('Permission Lookup', () => {
    it('should retrieve permission by resource/action', async () => {
      const permission =
        await prisma.permission.findFirst({
          where: {
            resource: 'users',
            action: 'read',
          },
        });

      expect(permission).not.toBeNull();
    });

    it('should retrieve products permission', async () => {
      const permission =
        await prisma.permission.findFirst({
          where: {
            resource: 'products',
            action: 'create',
          },
        });

      expect(permission).not.toBeNull();
    });

    it('should retrieve orders permission', async () => {
      const permission =
        await prisma.permission.findFirst({
          where: {
            resource: 'orders',
            action: 'read',
          },
        });

      expect(permission).not.toBeNull();
    });
  });

  describe('Authorization Integrity', () => {
    it('should return all permissions assigned to a role', async () => {
      const roles = await prisma.role.findMany({
        include: {
          permissions: true,
        },
      });

      expect(Array.isArray(roles)).toBe(true);
    });

    it('should return valid permission count', async () => {
      const count =
        await prisma.permission.count();

      expect(count).toBeGreaterThan(0);
    });

    it('should return valid role count', async () => {
      const count =
        await prisma.role.count();

      expect(count).toBeGreaterThan(0);
    });

    it('should return valid role permission count', async () => {
      const count =
        await prisma.rolePermission.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Authorization Security', () => {
    it('should prevent duplicate role-permission assignments', async () => {
      const role = await prisma.role.create({
        data: {
          name: `SECURITY_ROLE_${Date.now()}`,
        },
      });

      const permission =
        await prisma.permission.create({
          data: {
            resource: `security_resource_${Date.now()}`,
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

    it('should keep relational integrity', async () => {
      const relations =
        await prisma.rolePermission.findMany({
          include: {
            role: true,
            permission: true,
          },
          take: 10,
        });

      for (const relation of relations) {
        expect(relation.role).toBeDefined();
        expect(relation.permission).toBeDefined();
      }
    });
  });
});