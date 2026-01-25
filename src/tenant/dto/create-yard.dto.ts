import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateYardDto {
  @IsUUID()
  branch_id: string;

  @IsString()
  @Length(1, 120)
  yard_name: string;

  @IsOptional()
  @IsString()
  location?: string;
}
