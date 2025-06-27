import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'heavyrentsecret',
      signOptions: { expiresIn: '1d' }
    }),
    UsersModule
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
