import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  company_id: string;

  @Column({ type: 'varchar', length: 160 })
  company_name: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  br_number: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  province: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Branch, (b) => b.company)
  branches: Branch[];
}
