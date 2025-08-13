import {
  Controller,
  Param,
  Req,
  UseGuards,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloseMyMonthlyAttendanceParamDto } from 'src/monthly-attendance/dtos/close-my-monthly-attendance-param.dto';
import { MonthlyAttendanceService } from './monthly-attendance.service';
import { MonthlyAttendance } from './monthly-attendance.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateUserMonthlyAttendanceStatusParam } from './dtos/update-user-monthly-attendance-status-param.dto';
import { UpdateUserMonthlyAttendanceStatus } from './dtos/update-user-monthly-attendance-status.dto';
import { DeleteUserMonthlyAttendanceParam } from './dtos/delete-user-monthly-attendance-param.dto';

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

  @Patch('users/:user_id/monthly-attendance/:target_month/status')
  @UseGuards(AuthGuard, AdminGuard)
  public updateUserMonthlyAttendanceStatus(
    @Param() param: UpdateUserMonthlyAttendanceStatusParam,
    @Body() body: UpdateUserMonthlyAttendanceStatus,
  ): Promise<MonthlyAttendance> {
    return this.monthlyAttendanceService.updateUserMonthlyAttendanceStatus(
      param,
      body,
    );
  }

  @Delete('users/:user_id/monthly-attendance/:target_month')
  @UseGuards(AuthGuard, AdminGuard)
  public deleteUserMonthAttendance(
    @Param() param: DeleteUserMonthlyAttendanceParam,
  ): Promise<void> {
    return this.monthlyAttendanceService.deleteUserMonthlyAttendance(param);
  }
}
