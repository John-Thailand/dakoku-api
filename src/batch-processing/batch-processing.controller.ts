import { Controller, Post } from '@nestjs/common';
import { MonthlyAttendanceService } from 'src/monthly-attendance/monthly-attendance.service';

@Controller('batch')
export class BatchProcessingController {
  constructor(
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
  ) {}

  @Post('monthly-attendance/current')
  public createMonthlyAttendanceForThisMonth() {
    return this.monthlyAttendanceService.createMonthlyAttendanceForThisMonth();
  }
}
