import { IsEnum, IsNotEmpty } from 'class-validator';
import { MonthlyAttendanceStatus } from '../enums/monthly-attendance-status.enum';

export class UpdateUserMonthlyAttendanceStatus {
  @IsEnum(MonthlyAttendanceStatus)
  @IsNotEmpty()
  status: MonthlyAttendanceStatus;
}
