import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RefreshSession } from './refresh-session.entity';

@Entity('login_sessions')
export class LoginSession {
  @PrimaryGeneratedColumn('uuid')
  session_id: string;

  @ManyToOne(() => User, (u) => u.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'text', nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Index('idx_login_sessions_user') // aligns with your partial index in SQL (TypeORM can't express WHERE in decorator cleanly)
  @Column({ type: 'timestamptz', nullable: true })
  revoked_at: Date | null;

  @OneToMany(() => RefreshSession, (r) => r.session)
  refreshes: RefreshSession[];
}