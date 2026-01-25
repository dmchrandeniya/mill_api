import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CompaniesService } from '../services/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('tenant/companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() pag: PaginationQueryDto,
    @Query('q') q?: string,
  ) {
    return this.service.findAll({
      page: pag.page ?? 1,
      limit: pag.limit ?? 20,
      q,
    });
  }

  @Get(':company_id')
  findOne(@Param('company_id') company_id: string) {
    return this.service.findOne(company_id);
  }

  @Patch(':company_id')
  update(@Param('company_id') company_id: string, @Body() dto: UpdateCompanyDto) {
    return this.service.update(company_id, dto);
  }

  @Delete(':company_id')
  remove(@Param('company_id') company_id: string) {
    return this.service.remove(company_id);
  }
}
