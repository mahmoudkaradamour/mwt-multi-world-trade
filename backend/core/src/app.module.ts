import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: 'MWT_DEVELOPMENT_SECRET_KEY',
    }),
  ],
})
export class AppModule {}