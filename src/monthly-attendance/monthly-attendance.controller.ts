import { Controller, Put, Param, Req, UseGuards } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller()
export class MonthlyAttendanceController {
  @Put('users/me/monthly-attendance/:targetMonth')
  @UseGuards(AuthGuard)
  public closeMyMonthlyAttendance(
    @Req() request,
    // TODO: バリデーション
    @Param('targetMonth') targetMonth: string,
  ) {
    const requestUser = request[REQUEST_USER_KEY];
    console.log(requestUser.sub);
    console.log(targetMonth);
  }
}
