import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../tenant/entities/company.entity';

@Entity('roles')
@Unique(['company_id', 'role_name'])
export class Role {
  @PrimaryGeneratedColumn('uuid')
  role_id: string;

  @Column('uuid')
  company_id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 60 })
  role_name: string;

  @Column({ default: false })
  is_system: boolean;
}
