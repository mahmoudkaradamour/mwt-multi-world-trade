import { PrismaClient } from '@prisma/client';

describe('User Module (E2E)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Entity Validation', () => {
    const testEmail = `user-test-${Date.now()}@mwt.com`;

    let userId: string;

    it('should create a user successfully', async () => {
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          password: 'hashed_password',
        },
      });

      userId = user.id;

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.createdAt).toBeDefined();
    });

    it('should retrieve user by id', async () => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      expect(user).not.toBeNull();
      expect(user?.id).toBe(userId);
    });

    it('should retrieve user by email', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: testEmail,
        },
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe(testEmail);
    });

    it('should update user password', async () => {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: 'updated_password_hash',
        },
      });

      expect(updatedUser.password).toBe(
        'updated_password_hash',
      );
    });

    it('should verify updated user exists', async () => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      expect(user).not.toBeNull();
      expect(user?.password).toBe(
        'updated_password_hash',
      );
    });

    it('should delete user successfully', async () => {
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      expect(deletedUser.id).toBe(userId);
    });

    it('should confirm user deletion', async () => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      expect(user).toBeNull();
    });
  });

  describe('User Constraints', () => {
    it('should enforce unique email addresses', async () => {
      const email = `unique-user-${Date.now()}@mwt.com`;

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

  describe('Database Integrity', () => {
    it('should return a valid user count', async () => {
      const count = await prisma.user.count();

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should retrieve users list successfully', async () => {
      const users = await prisma.user.findMany({
        take: 10,
      });

      expect(Array.isArray(users)).toBe(true);
    });
  });
});