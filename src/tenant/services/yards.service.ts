import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Yard } from '../entities/yard.entity';
import { Branch } from '../entities/branch.entity';
import { CreateYardDto } from '../dto/create-yard.dto';
import { UpdateYardDto } from '../dto/update-yard.dto';

@Injectable()
export class YardsService {
  constructor(
    @InjectRepository(Yard) private readonly repo: Repository<Yard>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
  ) {}

  async create(dto: CreateYardDto): Promise<Yard> {
    const branch = await this.branchRepo.findOne({ where: { branch_id: dto.branch_id } });
    if (!branch) throw new NotFoundException('Branch not found');

    const dup = await this.repo.findOne({
      where: { branch_id: dto.branch_id, yard_name: dto.yard_name },
    });
    if (dup) throw new ConflictException('Yard name already exists for this branch');

    const entity: Yard = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(params: { page: number; limit: number; q?: string; branch_id?: string }) {
    const { page, limit, q, branch_id } = params;

    const where: any = {};
    if (branch_id) where.branch_id = branch_id;

    const queryWhere = q
      ? [
          { ...where, yard_name: ILike(`%${q}%`) },
          { ...where, location: ILike(`%${q}%`) },
        ]
      : [where];

    const [items, total] = await this.repo.findAndCount({
      where: queryWhere,
      relations: { branch: { company: true } } as any,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOne(yard_id: string): Promise<Yard> {
    const y = await this.repo.findOne({
      where: { yard_id },
      relations: { branch: { company: true } } as any,
    });
    if (!y) throw new NotFoundException('Yard not found');
    return y;
  }

  async update(yard_id: string, dto: UpdateYardDto): Promise<Yard> {
    const y = await this.findOne(yard_id);

    if (dto.branch_id) {
      const branch = await this.branchRepo.findOne({ where: { branch_id: dto.branch_id } });
      if (!branch) throw new NotFoundException('Branch not found');
      y.branch_id = dto.branch_id;
    }
    if (dto.yard_name) y.yard_name = dto.yard_name;
    if (dto.location !== undefined) y.location = dto.location as any;

    const dup = await this.repo.findOne({
      where: { branch_id: y.branch_id, yard_name: y.yard_name },
    });
    if (dup && dup.yard_id !== y.yard_id) {
      throw new ConflictException('Yard name already exists for this branch');
    }

    return this.repo.save(y);
  }

  async remove(yard_id: string): Promise<void> {
    const res = await this.repo.delete(yard_id);
    if (!res.affected) throw new NotFoundException('Yard not found');
  }
}
