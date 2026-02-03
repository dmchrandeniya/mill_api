import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  perm_id: string;

  @Column({ length: 120, unique: true })
  perm_key: string;

  @Column({ type: 'text', nullable: true })
  perm_desc?: string;
}
