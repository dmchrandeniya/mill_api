import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LoginSession } from './login-session.entity';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  refresh_id: string;

  @ManyToOne(() => LoginSession, (s) => s.refreshes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: LoginSession;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revoked_at: Date | null;
}