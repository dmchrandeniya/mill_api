import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { PermissionGuard } from './guards/permission.guard';

import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleSeedService } from './seeds/role-seed.service';
import { PermissionSeedService } from './seeds/permission-seed.service';
import { UserRoleSeedService } from './seeds/user-role-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole]),
  ],
  providers: [
    RbacService,
    PermissionGuard,
    PermissionSeedService,
    RoleSeedService,
    UserRoleSeedService,
  ],
  exports: [
    RbacService,
    PermissionGuard,
    RoleSeedService,
    PermissionSeedService,
    RoleSeedService,
    UserRoleSeedService,
  ],
})
export class RbacModule {}
