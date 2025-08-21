import { Module } from '@nestjs/common';
import { MonthlyAttendanceRecordsController } from './monthly-attendance-records.controller';
import { MonthlyAttendanceRecordsService } from './monthly-attendance-records.service';

@Module({
  controllers: [MonthlyAttendanceRecordsController],
  providers: [MonthlyAttendanceRecordsService],
})
export class MonthlyAttendanceRecordsModule {}
