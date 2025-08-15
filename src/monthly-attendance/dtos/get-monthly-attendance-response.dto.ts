import { MonthlyAttendance } from '../monthly-attendance.entity';

export class GetMonthlyAttendanceResponseDto {
  monthly_attendance: MonthlyAttendance[];

  total: number;
}
