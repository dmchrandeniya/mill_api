import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePermRepo: Repository<RolePermission>,
  ) {}

  async getUserPermissions(
    userId: string,
    companyId: string,
  ): Promise<string[]> {
    const roles = await this.userRoleRepo
      .createQueryBuilder('ur')
      .innerJoin('ur.role', 'r')
      .where('ur.user_id = :userId', { userId })
      .andWhere('r.company_id = :companyId', { companyId })
      .select('ur.role_id')
      .getRawMany();

    if (!roles.length) return [];

    const roleIds = roles.map((r) => r.role_id);

    const permissions = await this.rolePermRepo
      .createQueryBuilder('rp')
      .innerJoin('rp.permission', 'p')
      .where('rp.role_id IN (:...roleIds)', { roleIds })
      .select('p.perm_key', 'perm_key')
      .getRawMany();

    return permissions.map((p) => p.perm_key);
  }
}
