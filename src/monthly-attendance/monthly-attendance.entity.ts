import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MonthlyAttendanceStatus } from './enums/monthly-attendance-status.enum';
import { User } from 'src/users/user.entity';

@Entity('monthly_attendance')
export class MonthlyAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'char',
  //   length: 36,
  //   nullable: false,
  // })
  // user_id: string;

  @ManyToOne(() => User, (user) => user.monthly_attendance)
  // JoinColumnを設定していないと、カラム名がuserIdになってしまう
  @JoinColumn({ name: 'user_id' })
  user: User;

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
}
