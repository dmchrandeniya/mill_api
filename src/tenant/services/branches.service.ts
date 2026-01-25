import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { Company } from '../entities/company.entity';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private readonly repo: Repository<Branch>,
    @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateBranchDto): Promise<Branch> {
    // Validate company exists
    const company = await this.companyRepo.findOne({ where: { company_id: dto.company_id } });
    if (!company) throw new NotFoundException('Company not found');

    // Enforce UNIQUE(company_id, branch_name)
    const dup = await this.repo.findOne({
      where: { company_id: dto.company_id, branch_name: dto.branch_name },
    });
    if (dup) throw new ConflictException('Branch name already exists for this company');

    const entity: Branch = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async findAll(params: { page: number; limit: number; q?: string; company_id?: string }) {
    const { page, limit, q, company_id } = params;

    const where: any = {};
    if (company_id) where.company_id = company_id;

    const queryWhere = q
      ? [
          { ...where, branch_name: ILike(`%${q}%`) },
          { ...where, district: ILike(`%${q}%`) },
        ]
      : [where];

    const [items, total] = await this.repo.findAndCount({
      where: queryWhere,
      relations: { company: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOne(branch_id: string): Promise<Branch> {
    const b = await this.repo.findOne({ where: { branch_id }, relations: { company: true } });
    if (!b) throw new NotFoundException('Branch not found');
    return b;
  }

  async update(branch_id: string, dto: UpdateBranchDto): Promise<Branch> {
    const b = await this.findOne(branch_id);

    if (dto.company_id) {
      const company = await this.companyRepo.findOne({ where: { company_id: dto.company_id } });
      if (!company) throw new NotFoundException('Company not found');
      b.company_id = dto.company_id;
    }
    if (dto.branch_name) b.branch_name = dto.branch_name;
    if (dto.address !== undefined) b.address = dto.address as any;
    if (dto.district !== undefined) b.district = dto.district as any;

    // Re-check uniqueness if company_id or branch_name changed
    const dup = await this.repo.findOne({
      where: { company_id: b.company_id, branch_name: b.branch_name },
    });
    if (dup && dup.branch_id !== b.branch_id) {
      throw new ConflictException('Branch name already exists for this company');
    }

    return this.repo.save(b);
  }

  async remove(branch_id: string): Promise<void> {
    const res = await this.repo.delete(branch_id);
    if (!res.affected) throw new NotFoundException('Branch not found');
  }
}
