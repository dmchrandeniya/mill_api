import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserRoleSeedService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async assignOwner(userId: string, companyId: string) {
    const ownerRole = await this.roleRepo.findOne({
      where: {
        company_id: companyId,
        role_name: 'Owner',
      },
    });

    if (!ownerRole) return;

    const exists = await this.userRoleRepo.findOne({
      where: {
        user_id: userId,
        role_id: ownerRole.role_id,
      },
    });

    if (!exists) {
      await this.userRoleRepo.save({
        user_id: userId,
        role_id: ownerRole.role_id,
      });
    }
  }
}
