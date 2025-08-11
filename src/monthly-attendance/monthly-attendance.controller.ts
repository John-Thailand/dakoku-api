import { Controller, Put, Param, Req, UseGuards } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloseMyMonthlyAttendanceDto } from 'src/users/dtos/close-my-monthly-attendance.dto';
import { MonthlyAttendanceService } from './monthly-attendance.service';
import { MonthlyAttendance } from './monthly-attendance.entity';

@Controller()
export class MonthlyAttendanceController {
  constructor(
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
  ) {}

  @Put('users/me/monthly-attendance/:target_month')
  @UseGuards(AuthGuard)
  public closeMyMonthlyAttendance(
    @Req() request,
    @Param() param: CloseMyMonthlyAttendanceDto,
  ): Promise<MonthlyAttendance> {
    return this.monthlyAttendanceService.closeMyMonthlyAttendance(
      request.sub,
      param,
    );
  }
}
