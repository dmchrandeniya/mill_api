import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from './company.entity';
import { Yard } from './yard.entity';

@Entity('branches')
@Unique(['company_id', 'branch_name'])
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  branch_id: string;

  // Keep FK column explicit for easy filtering
  @Column({ type: 'uuid' })
  company_id: string;

  @ManyToOne(() => Company, (c) => c.branches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar', length: 120 })
  branch_name: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  district: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Yard, (y) => y.branch)
  yards: Yard[];
}
