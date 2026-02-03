import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { SYSTEM_ROLES } from './roles.seed';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,

    @InjectRepository(RolePermission)
    private readonly rolePermRepo: Repository<RolePermission>,
  ) {}

  async seedSystemRoles(companyId: string) {
    for (const roleDef of Object.values(SYSTEM_ROLES)) {
      let role = await this.roleRepo.findOne({
        where: {
          company_id: companyId,
          role_name: roleDef.name,
        },
      });

      if (!role) {
        role = await this.roleRepo.save({
          company_id: companyId,
          role_name: roleDef.name,
          is_system: true,
        });
      }

      for (const permKey of roleDef.permissions) {
        const perm = await this.permRepo.findOne({
          where: { perm_key: permKey },
        });

        if (!perm) continue;

        const exists = await this.rolePermRepo.findOne({
          where: {
            role_id: role.role_id,
            perm_id: perm.perm_id,
          },
        });

        if (!exists) {
          await this.rolePermRepo.save({
            role_id: role.role_id,
            perm_id: perm.perm_id,
          });
        }
      }
    }
  }
}
