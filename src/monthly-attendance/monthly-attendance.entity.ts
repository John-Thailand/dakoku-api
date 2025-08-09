import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MonthlyAttendanceStatus } from './enums/monthly-attendance-status.enum';

@Entity('monthly_attendance')
export class MonthlyAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'char',
    length: 36,
    nullable: false,
  })
  user_id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  target_month: Date;

  @Column({
    type: 'enum',
    enum: MonthlyAttendanceStatus,
    nullable: false,
    default: MonthlyAttendanceStatus.OPEN,
  })
  status: MonthlyAttendanceStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // TODO: Userエンティティとのリレーションを設定
}
