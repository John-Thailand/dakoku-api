import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminMonthlyTaskStatus } from './enums/admin-monthly-task-status.enum';

@Entity('admin_monthly_tasks')
export class AdminMonthlyTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    nullable: false,
    unique: true,
  })
  target_month: Date;

  @Column({
    type: 'enum',
    enum: AdminMonthlyTaskStatus,
    nullable: false,
    default: AdminMonthlyTaskStatus.PENDING,
  })
  status: AdminMonthlyTaskStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
