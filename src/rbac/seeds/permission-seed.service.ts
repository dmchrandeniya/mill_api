import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { SYSTEM_PERMISSIONS } from './permissions.seed';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async seedGlobalPermissions() {
    for (const perm of SYSTEM_PERMISSIONS) {
      const exists = await this.permRepo.findOne({
        where: { perm_key: perm.key },
      });

      if (!exists) {
        await this.permRepo.save({
          perm_key: perm.key,
          perm_desc: perm.desc,
        });
      }
    }
  }
}
