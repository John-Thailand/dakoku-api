import { Controller, Post } from '@nestjs/common';
import { AdminMonthlyTasksService } from 'src/admin-monthly-tasks/admin-monthly-tasks.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { MonthlyAttendanceDto } from 'src/monthly-attendance/dtos/monthly-attendance.dto';
import { MonthlyAttendanceService } from 'src/monthly-attendance/monthly-attendance.service';

@Controller('batch')
export class BatchProcessingController {
  constructor(
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
    private readonly adminMonthlyTasksService: AdminMonthlyTasksService,
  ) {}

  @Post('monthly-attendance/current')
  // TODO: AuthGuardやAdminGuardが必要かも
  @Serialize(MonthlyAttendanceDto)
  public createMonthlyAttendanceForThisMonth() {
    return this.monthlyAttendanceService.createMonthlyAttendanceForThisMonth();
  }

  @Post('admin-monthly-tasks/current')
  // TODO: AuthGuardやAdminGuardが必要かも
  public createCurrentAdminMonthlyTask() {
    return this.adminMonthlyTasksService.createCurrentAdminMonthlyTask();
  }
}
