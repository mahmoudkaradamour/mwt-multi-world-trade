import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Authentication module.
 *
 * Provides user registration,
 * login and token generation.
 */
@Module({
  imports: [
    
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',
  },
})
,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}