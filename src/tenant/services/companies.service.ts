import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    // Optional: guard against duplicate company_name+br_number combos if you want.
    const entity: Company = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async findAll(params: { page: number; limit: number; q?: string }) {
    const { page, limit, q } = params;
    const where = q
      ? [
          { company_name: ILike(`%${q}%`) },
          { br_number: ILike(`%${q}%`) },
          { district: ILike(`%${q}%`) },
          { province: ILike(`%${q}%`) },
        ]
      : undefined;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOne(company_id: string): Promise<Company> {
    const c = await this.repo.findOne({ where: { company_id } });
    if (!c) throw new NotFoundException('Company not found');
    return c;
  }

  async update(company_id: string, dto: UpdateCompanyDto): Promise<Company> {
    const c = await this.findOne(company_id);
    Object.assign(c, dto);
    return this.repo.save(c);
  }

  async remove(company_id: string): Promise<void> {
    const res = await this.repo.delete(company_id);
    if (!res.affected) throw new NotFoundException('Company not found');
  }
}
