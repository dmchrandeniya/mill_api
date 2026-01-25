import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 160)
  company_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 32)
  br_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60)
  district?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60)
  province?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;
}
