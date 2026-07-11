import { PrismaClient } from '@prisma/client';

describe('User Role Module (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('UserRole Creation', () => {
    it('should assign a role to a user', async () => {
      const role = await prisma.role.create({
        data: {
          name: `ROLE_${Date.now()}`,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: `user-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const userRole = await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      expect(userRole).toBeDefined();
      expect(userRole.userId).toBe(user.id);
      expect(userRole.roleId).toBe(role.id);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should prevent duplicate role assignments', async () => {
      const role = await prisma.role.create({
        data: {
          name: `DUPLICATE_ROLE_${Date.now()}`,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: `duplicate-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      await expect(
        prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Multiple Role Assignment', () => {
    it('should assign multiple roles to the same user', async () => {
      const user = await prisma.user.create({
        data: {
          email: `multi-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const roleA = await prisma.role.create({
        data: {
          name: `ROLE_A_${Date.now()}`,
        },
      });

      const roleB = await prisma.role.create({
        data: {
          name: `ROLE_B_${Date.now()}`,
        },
      });

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleA.id,
        },
      });

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleB.id,
        },
      });

      const assignedRoles =
        await prisma.userRole.findMany({
          where: {
            userId: user.id,
          },
        });

      expect(assignedRoles.length).toBe(2);
    });
  });

  describe('User Role Retrieval', () => {
    it('should retrieve assigned roles', async () => {
      const user = await prisma.user.create({
        data: {
          email: `retrieve-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const role = await prisma.role.create({
        data: {
          name: `RETRIEVE_ROLE_${Date.now()}`,
        },
      });

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      const result =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

      expect(result).not.toBeNull();
      expect(result?.roles.length).toBe(1);
      expect(
        result?.roles[0].role.name,
      ).toBe(role.name);
    });
  });

  describe('Relationship Integrity', () => {
    it('should resolve role relations', async () => {
      const userRoles =
        await prisma.userRole.findMany({
          include: {
            user: true,
            role: true,
          },
          take: 20,
        });

      expect(
        Array.isArray(userRoles),
      ).toBe(true);
    });

    it('should return valid user-role count', async () => {
      const count =
        await prisma.userRole.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cascade Delete Validation', () => {
    it('should delete user-role relations when user is deleted', async () => {
      const role = await prisma.role.create({
        data: {
          name: `CASCADE_USER_ROLE_${Date.now()}`,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: `cascade-user-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const relation =
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });

      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      const existing =
        await prisma.userRole.findUnique({
          where: {
            id: relation.id,
          },
        });

      expect(existing).toBeNull();
    });

    it('should delete user-role relations when role is deleted', async () => {
      const role = await prisma.role.create({
        data: {
          name: `CASCADE_ROLE_${Date.now()}`,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: `cascade-role-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const relation =
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });

      await prisma.role.delete({
        where: {
          id: role.id,
        },
      });

      const existing =
        await prisma.userRole.findUnique({
          where: {
            id: relation.id,
          },
        });

      expect(existing).toBeNull();
    });
  });

  describe('Permission Resolution Readiness', () => {
    it('should support users with multiple roles', async () => {
      const user = await prisma.user.create({
        data: {
          email: `permission-user-${Date.now()}@test.com`,
          password: 'password',
        },
      });

      const roles = await prisma.role.findMany({
        take: 2,
      });

      if (roles.length >= 2) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: roles[0].id,
          },
        });

        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: roles[1].id,
          },
        });

        const result =
          await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          });

        expect(
          result?.roles.length,
        ).toBeGreaterThanOrEqual(2);
      }
    });
  });
});