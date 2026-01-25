import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateBranchDto {
  @IsUUID()
  company_id: string;

  @IsString()
  @Length(1, 120)
  branch_name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60)
  district?: string;
}
