import { AttendanceType } from 'src/attendance-types/attendance-type.entity';
import { MonthlyAttendance } from 'src/monthly-attendance/monthly-attendance.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('monthly_attendance_records')
@Unique('unique_monthly_attendance_id_date', ['monthly_attendance_id', 'date'])
export class MonthlyAttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    name: 'monthly_attendance_id',
    type: 'char',
    length: 36,
    nullable: false,
  })
  monthly_attendance_id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Index()
  @Column({
    name: 'attendance_type_id',
    type: 'char',
    length: 36,
    nullable: false,
  })
  attendance_type_id: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  start_time: Date | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  end_time: Date | null;

  // 'HH:mm:ss'
  @Column({
    type: 'time',
    nullable: true,
  })
  break_time: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  job_description: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  remarks: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @ManyToOne(
    () => MonthlyAttendance,
    (monthly_attendance) => monthly_attendance.monthly_attendance_records,
  )
  @JoinColumn({ name: 'monthly_attendance_id' })
  monthly_attendance: MonthlyAttendance;

  @ManyToOne(
    () => AttendanceType,
    (attendance_type) => attendance_type.monthly_attendance_records,
  )
  @JoinColumn({ name: 'attendance_type_id' })
  attendance_type: AttendanceType;
}
