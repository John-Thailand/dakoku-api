import { MonthlyAttendanceRecord } from 'src/monthly-attendance-records/monthly-attendance-record.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attendance-types')
export class AttendanceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false,
  })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(
    () => MonthlyAttendanceRecord,
    (monthly_attendance_record) => monthly_attendance_record.attendance_type,
  )
  monthly_attendance_records: MonthlyAttendanceRecord[];
}
