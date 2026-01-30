import { Injectable, ConflictException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(user_id: string) {
    return this.usersRepo.findOne({ where: { user_id } });
  }

  async create(dto: CreateUserDto) {
  const exists = await this.usersRepo.findOne({
    where: { email: dto.email },
  });

  if (exists) {
    throw new ConflictException('Email already exists');
  }

  const password_hash = await bcrypt.hash(dto.password, 10);

  const user = this.usersRepo.create({
    full_name: dto.full_name,
    email: dto.email,
    password_hash,
    company_id: dto.company_id,
    branch_id: dto.branch_id ?? null,
    phone: dto.phone ?? null,
  });

  return this.usersRepo.save(user);
}

}