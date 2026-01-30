import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LoginSession } from './entities/login-session.entity';
import { RefreshSession } from './entities/refresh-session.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([LoginSession, RefreshSession]),
    JwtModule.register({}), // secrets passed in service verify/sign options
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}