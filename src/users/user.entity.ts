import { MonthlyAttendance } from 'src/monthly-attendance/monthly-attendance.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  name: string;

  // ユニーク制約で同じメールアドレスを登録できないようにする
  @Column({
    type: 'varchar',
    length: 96,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_administrator: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_email_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(
    () => MonthlyAttendance,
    (monthlyAttendance) => monthlyAttendance.user,
  )
  monthly_attendance: MonthlyAttendance[];
}
