import { PrismaClient } from '@prisma/client';

describe('Permission Module (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Permission Creation', () => {
    const resource = `test_resource_${Date.now()}`;
    const action = 'read';

    it('should create a permission', async () => {
      const permission = await prisma.permission.create({
        data: {
          resource,
          action,
        },
      });

      expect(permission).toBeDefined();
      expect(permission.resource).toBe(resource);
      expect(permission.action).toBe(action);
    });

    it('should retrieve permission by resource and action', async () => {
      const permission = await prisma.permission.findUnique({
        where: {
          resource_action: {
            resource,
            action,
          },
        },
      });

      expect(permission).not.toBeNull();
      expect(permission?.resource).toBe(resource);
      expect(permission?.action).toBe(action);
    });
  });

  describe('Permission Uniqueness', () => {
    it('should prevent duplicate permissions', async () => {
      const resource = `unique_resource_${Date.now()}`;
      const action = 'create';

      await prisma.permission.create({
        data: {
          resource,
          action,
        },
      });

      await expect(
        prisma.permission.create({
          data: {
            resource,
            action,
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Permission Queries', () => {
    it('should retrieve permissions list', async () => {
      const permissions = await prisma.permission.findMany({
        take: 50,
      });

      expect(Array.isArray(permissions)).toBe(true);
    });

    it('should return valid permission count', async () => {
      const count = await prisma.permission.count();

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Permission Update', () => {
    let permissionId: string;

    it('should create permission for update test', async () => {
      const permission = await prisma.permission.create({
        data: {
          resource: `update_resource_${Date.now()}`,
          action: 'read',
        },
      });

      permissionId = permission.id;

      expect(permission).toBeDefined();
    });

    it('should update permission action', async () => {
      const updated = await prisma.permission.update({
        where: {
          id: permissionId,
        },
        data: {
          action: 'update',
        },
      });

      expect(updated.action).toBe('update');
    });
  });

  describe('Permission Delete', () => {
    let permissionId: string;

    it('should create permission for delete test', async () => {
      const permission = await prisma.permission.create({
        data: {
          resource: `delete_resource_${Date.now()}`,
          action: 'read',
        },
      });

      permissionId = permission.id;

      expect(permission).toBeDefined();
    });

    it('should delete permission', async () => {
      const deleted = await prisma.permission.delete({
        where: {
          id: permissionId,
        },
      });

      expect(deleted.id).toBe(permissionId);
    });

    it('should verify permission deletion', async () => {
      const permission = await prisma.permission.findUnique({
        where: {
          id: permissionId,
        },
      });

      expect(permission).toBeNull();
    });
  });

  describe('Seed Validation', () => {
    it('should contain seeded permissions', async () => {
      const permission = await prisma.permission.findFirst({
        where: {
          resource: 'users',
          action: 'read',
        },
      });

      expect(permission).not.toBeNull();
    });

    it('should contain products permissions', async () => {
      const permission = await prisma.permission.findFirst({
        where: {
          resource: 'products',
          action: 'create',
        },
      });

      expect(permission).not.toBeNull();
    });

    it('should contain orders permissions', async () => {
      const permission = await prisma.permission.findFirst({
        where: {
          resource: 'orders',
          action: 'read',
        },
      });

      expect(permission).not.toBeNull();
    });
  });
});