import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { AuthorizationService } from './authorization.service';

import { PermissionGuard } from './guards/permission.guard';

import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Authentication Module.
 *
 * Provides:
 * - User registration
 * - User login
 * - JWT authentication
 * - Permission resolution
 * - Authorization services
 */
@Module({
  imports: [
    PrismaModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    AuthorizationService,
    PermissionGuard,
  ],

  exports: [
    AuthorizationService,
    PermissionGuard,
  ],
})
export class AuthModule {}