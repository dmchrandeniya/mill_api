import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './entities/company.entity';
import { Branch } from './entities/branch.entity';
import { Yard } from './entities/yard.entity';

import { CompaniesService } from './services/companies.service';
import { BranchesService } from './services/branches.service';
import { YardsService } from './services/yards.service';

import { CompaniesController } from './controllers/companies.controller';
import { BranchesController } from './controllers/branches.controller';
import { YardsController } from './controllers/yards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Branch, Yard])],
  controllers: [CompaniesController, BranchesController, YardsController],
  providers: [CompaniesService, BranchesService, YardsService],
  exports: [TypeOrmModule],
})
export class TenantModule {}
