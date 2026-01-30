import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './health/health.module';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    // Loads .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL connection
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    HealthModule,
    TenantModule,
    AuthModule,
    UsersModule,
    
  ],
})
export class AppModule {}

