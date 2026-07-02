import { PrismaClient } from '@prisma/client';

describe('Database (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Database Connection', () => {
    it('should connect to PostgreSQL successfully', async () => {
      const result = await prisma.$queryRaw`SELECT 1`;

      expect(result).toBeDefined();
    });
  });

  describe('User Model', () => {
    const email = `db-test-${Date.now()}@mwt.com`;

    let createdUserId: string;

    it('should create a user record', async () => {
      const user = await prisma.user.create({
        data: {
          email,
          password: 'hashed_password',
        },
      });

      createdUserId = user.id;

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should find user by email', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
    });

    it('should find user by id', async () => {
      const user = await prisma.user.findUnique({
        where: {
          id: createdUserId,
        },
      });

      expect(user).toBeDefined();
      expect(user?.id).toBe(createdUserId);
    });

    it('should update a user record', async () => {
      const updated = await prisma.user.update({
        where: {
          id: createdUserId,
        },
        data: {
          password: 'updated_password',
        },
      });

      expect(updated.password).toBe(
        'updated_password',
      );
    });

    it('should delete a user record', async () => {
      const deleted = await prisma.user.delete({
        where: {
          id: createdUserId,
        },
      });

      expect(deleted.id).toBe(createdUserId);

      const user = await prisma.user.findUnique({
        where: {
          id: createdUserId,
        },
      });

      expect(user).toBeNull();
    });
  });

  describe('Database Integrity', () => {
    it('should enforce unique email constraint', async () => {
      const email = `unique-${Date.now()}@mwt.com`;

      await prisma.user.create({
        data: {
          email,
          password: 'password',
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email,
            password: 'password',
          },
        }),
      ).rejects.toThrow();
    });
  });
});