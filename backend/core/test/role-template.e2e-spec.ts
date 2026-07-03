import { PrismaClient } from '@prisma/client';

describe('Role Template Module (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Role Template Creation', () => {
    const templateName =
      `TEST_TEMPLATE_${Date.now()}`;

    it('should create a role template', async () => {
      const template =
        await prisma.roleTemplate.create({
          data: {
            name: templateName,
            description:
              'Role template creation test',
          },
        });

      expect(template).toBeDefined();
      expect(template.name).toBe(templateName);
    });

    it('should retrieve role template', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: templateName,
          },
        });

      expect(template).not.toBeNull();
      expect(template?.name).toBe(templateName);
    });
  });

  describe('Role Template Uniqueness', () => {
    it('should prevent duplicate templates', async () => {
      const name =
        `UNIQUE_TEMPLATE_${Date.now()}`;

      await prisma.roleTemplate.create({
        data: {
          name,
        },
      });

      await expect(
        prisma.roleTemplate.create({
          data: {
            name,
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Template Permission Mapping', () => {
    let templateId: string;
    let permissionId: string;

    beforeAll(async () => {
      const template =
        await prisma.roleTemplate.create({
          data: {
            name:
              `MAPPING_TEMPLATE_${Date.now()}`,
          },
        });

      templateId = template.id;

      const permission =
        await prisma.permission.create({
          data: {
            resource:
              `template_resource_${Date.now()}`,
            action: 'read',
          },
        });

      permissionId = permission.id;
    });

    it('should assign permission to template', async () => {
      const relation =
        await prisma.roleTemplatePermission.create(
          {
            data: {
              roleTemplateId: templateId,
              permissionId,
            },
          },
        );

      expect(relation).toBeDefined();
      expect(
        relation.roleTemplateId,
      ).toBe(templateId);
    });

    it('should retrieve template permissions', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
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

      expect(template).not.toBeNull();
      expect(
        template?.permissions.length,
      ).toBe(1);
    });
  });

  describe('Template Permission Integrity', () => {
    it('should return valid template count', async () => {
      const count =
        await prisma.roleTemplate.count();

      expect(count).toBeGreaterThan(0);
    });

    it('should return valid template permission count', async () => {
      const count =
        await prisma.roleTemplatePermission.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should resolve template relations', async () => {
      const templates =
        await prisma.roleTemplate.findMany({
          include: {
            permissions: true,
          },
          take: 20,
        });

      expect(
        Array.isArray(templates),
      ).toBe(true);
    });
  });

  describe('Seeded Template Validation', () => {
    it('should contain Store Manager template', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Store Manager',
          },
          include: {
            permissions: true,
          },
        });

      expect(template).not.toBeNull();
      expect(
        template?.permissions.length,
      ).toBeGreaterThan(0);
    });

    it('should contain Inventory Manager template', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Inventory Manager',
          },
          include: {
            permissions: true,
          },
        });

      expect(template).not.toBeNull();
      expect(
        template?.permissions.length,
      ).toBeGreaterThan(0);
    });

    it('should contain Customer Support template', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Customer Support',
          },
          include: {
            permissions: true,
          },
        });

      expect(template).not.toBeNull();
      expect(
        template?.permissions.length,
      ).toBeGreaterThan(0);
    });
  });

  describe('Template Permission Mapping Validation', () => {
    it('Store Manager should have mapped permissions', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Store Manager',
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

      expect(template).not.toBeNull();

      const permissions =
        template?.permissions.map(
          (relation) =>
            `${relation.permission.resource}.${relation.permission.action}`,
        ) ?? [];

      expect(
        permissions.includes('stores.read'),
      ).toBe(true);

      expect(
        permissions.includes('products.read'),
      ).toBe(true);
    });

    it('Customer Support should have messages.reply', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Customer Support',
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

      const permissions =
        template?.permissions.map(
          (relation) =>
            `${relation.permission.resource}.${relation.permission.action}`,
        ) ?? [];

      expect(
        permissions.includes('messages.reply'),
      ).toBe(true);
    });

    it('Inventory Manager should have inventory.update', async () => {
      const template =
        await prisma.roleTemplate.findUnique({
          where: {
            name: 'Inventory Manager',
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

      const permissions =
        template?.permissions.map(
          (relation) =>
            `${relation.permission.resource}.${relation.permission.action}`,
        ) ?? [];

      expect(
        permissions.includes('inventory.update'),
      ).toBe(true);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should prevent duplicate template permission mappings', async () => {
      const template =
        await prisma.roleTemplate.create({
          data: {
            name:
              `DUPLICATE_TEMPLATE_${Date.now()}`,
          },
        });

      const permission =
        await prisma.permission.create({
          data: {
            resource:
              `dup_resource_${Date.now()}`,
            action: 'read',
          },
        });

      await prisma.roleTemplatePermission.create(
        {
          data: {
            roleTemplateId: template.id,
            permissionId: permission.id,
          },
        },
      );

      await expect(
        prisma.roleTemplatePermission.create(
          {
            data: {
              roleTemplateId: template.id,
              permissionId: permission.id,
            },
          },
        ),
      ).rejects.toThrow();
    });
  });

  describe('Cascade Delete Validation', () => {
    it('should delete template permission relations when template is deleted', async () => {
      const template =
        await prisma.roleTemplate.create({
          data: {
            name:
              `CASCADE_TEMPLATE_${Date.now()}`,
          },
        });

      const permission =
        await prisma.permission.create({
          data: {
            resource:
              `cascade_template_resource_${Date.now()}`,
            action: 'read',
          },
        });

      const relation =
        await prisma.roleTemplatePermission.create(
          {
            data: {
              roleTemplateId: template.id,
              permissionId: permission.id,
            },
          },
        );

      await prisma.roleTemplate.delete({
        where: {
          id: template.id,
        },
      });

      const existing =
        await prisma.roleTemplatePermission.findUnique(
          {
            where: {
              id: relation.id,
            },
          },
        );

      expect(existing).toBeNull();
    });
  });
});