import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // or username if you prefer

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  company_id?: string; // optional if you infer from user
}