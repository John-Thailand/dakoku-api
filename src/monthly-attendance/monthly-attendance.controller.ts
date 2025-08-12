import { Controller, Param, Req, UseGuards, Patch } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloseMyMonthlyAttendanceParamDto } from 'src/monthly-attendance/dtos/close-my-monthly-attendance-param.dto';
import { MonthlyAttendanceService } from './monthly-attendance.service';
import { MonthlyAttendance } from './monthly-attendance.entity';

@Controller()
export class MonthlyAttendanceController {
  constructor(
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
  ) {}

  // statusのみの部分更新なのでPatchを設定する
  // 月次勤怠のstatusを更新するということで/statusも追加しておく
  @Patch('users/me/monthly-attendance/:target_month/status')
  @UseGuards(AuthGuard)
  public closeMyMonthlyAttendance(
    @Req() request,
    @Param() param: CloseMyMonthlyAttendanceParamDto,
  ): Promise<MonthlyAttendance> {
    const requestUser = request[REQUEST_USER_KEY];
    return this.monthlyAttendanceService.closeMyMonthlyAttendance(
      requestUser.sub,
      param,
    );
  }
}
