import { Module } from '@nestjs/common';
import { MonthlyAttendanceController } from './monthly-attendance.controller';
import { MonthlyAttendanceService } from './monthly-attendance.service';

@Module({
  controllers: [MonthlyAttendanceController],
  providers: [MonthlyAttendanceService],
})
export class MonthlyAttendanceModule {}
