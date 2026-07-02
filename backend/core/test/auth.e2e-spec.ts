import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Authentication (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: `e2e_${Date.now()}@mwt.com`,
    password: '123456',
  };

  let accessToken = '';

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        'User registered',
      );

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });
  });

  describe('POST /auth/login', () => {
    it('should authenticate the user and return a JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        'Login success',
      );

      expect(response.body).toHaveProperty(
        'access_token',
      );

      accessToken = response.body.access_token;
    });
  });

  describe('GET /auth/profile', () => {
    it('should return profile data when a valid JWT is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

      expect(response.body).toHaveProperty('user');
    });

    it('should reject requests without a JWT token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });
  });
});