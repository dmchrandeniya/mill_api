import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('yards')
@Unique(['branch_id', 'yard_name'])
export class Yard {
  @PrimaryGeneratedColumn('uuid')
  yard_id: string;

  @Column({ type: 'uuid' })
  branch_id: string;

  @ManyToOne(() => Branch, (b) => b.yards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'varchar', length: 120 })
  yard_name: string;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
