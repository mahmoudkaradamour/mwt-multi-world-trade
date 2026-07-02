import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
/**
 * Root application module.
 *
 * Registers all application modules
 * and shared infrastructure components.
 */
@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

  PrismaModule,

  AuthModule,
],
})
export class AppModule {}