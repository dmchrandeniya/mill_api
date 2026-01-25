import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { YardsService } from '../services/yards.service';
import { CreateYardDto } from '../dto/create-yard.dto';
import { UpdateYardDto } from '../dto/update-yard.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('tenant/yards')
export class YardsController {
  constructor(private readonly service: YardsService) {}

  @Post()
  create(@Body() dto: CreateYardDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() pag: PaginationQueryDto,
    @Query('q') q?: string,
    @Query('branch_id') branch_id?: string,
  ) {
    return this.service.findAll({
      page: pag.page ?? 1,
      limit: pag.limit ?? 20,
      q,
      branch_id,
    });
  }

  @Get(':yard_id')
  findOne(@Param('yard_id') yard_id: string) {
    return this.service.findOne(yard_id);
  }

  @Patch(':yard_id')
  update(@Param('yard_id') yard_id: string, @Body() dto: UpdateYardDto) {
    return this.service.update(yard_id, dto);
  }

  @Delete(':yard_id')
  remove(@Param('yard_id') yard_id: string) {
    return this.service.remove(yard_id);
  }
}
