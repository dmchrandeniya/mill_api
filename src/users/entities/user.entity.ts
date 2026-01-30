import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LoginSession } from '../../auth/entities/login-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'uuid', nullable: true })
  branch_id: string | null;

  @Column({ type: 'varchar', length: 160 })
  full_name: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  nic: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  // NOTE: CITEXT works at DB-level; keep as "citext" here.
  @Column({ type: 'citext', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'text' })
  password_hash: string;

  // using enum name from DB: user_status_enum
  @Column({ type: 'enum', enumName: 'user_status_enum', default: 'Active' })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at: Date | null;

  @OneToMany(() => LoginSession, (s) => s.user)
  sessions: LoginSession[];
}