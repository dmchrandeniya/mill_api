import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BranchesService } from '../services/branches.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('tenant/branches')
export class BranchesController {
  constructor(private readonly service: BranchesService) {}

  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() pag: PaginationQueryDto,
    @Query('q') q?: string,
    @Query('company_id') company_id?: string,
  ) {
    return this.service.findAll({
      page: pag.page ?? 1,
      limit: pag.limit ?? 20,
      q,
      company_id,
    });
  }

  @Get(':branch_id')
  findOne(@Param('branch_id') branch_id: string) {
    return this.service.findOne(branch_id);
  }

  @Patch(':branch_id')
  update(@Param('branch_id') branch_id: string, @Body() dto: UpdateBranchDto) {
    return this.service.update(branch_id, dto);
  }

  @Delete(':branch_id')
  remove(@Param('branch_id') branch_id: string) {
    return this.service.remove(branch_id);
  }
}
