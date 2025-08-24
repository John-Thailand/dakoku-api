import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MonthlyAttendanceRecordsService } from './monthly-attendance-records.service';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { UpdateMyRecordDto } from './dtos/update-my-record.dto';

@Controller('monthly-attendance-records')
export class MonthlyAttendanceRecordsController {
  constructor(
    private readonly monthlyAttendanceRecordsService: MonthlyAttendanceRecordsService,
  ) {}

  @Post('clock-in')
  @UseGuards(AuthGuard)
  public createWorkRecord(@Req() request) {
    const requestUser = request[REQUEST_USER_KEY];
    return this.monthlyAttendanceRecordsService.createWorkRecord(
      requestUser.sub,
    );
  }

  @Put('clock-out')
  @UseGuards(AuthGuard)
  public updateWorkRecord(@Req() request) {
    const requestUser = request[REQUEST_USER_KEY];
    return this.monthlyAttendanceRecordsService.updateWorkRecord(
      requestUser.sub,
    );
  }

  @Put()
  @UseGuards(AuthGuard)
  public updateMyRecord(@Req() request, @Body() body: UpdateMyRecordDto) {
    const requestUser = request[REQUEST_USER_KEY];
    return this.monthlyAttendanceRecordsService.updateMyRecord(
      requestUser.sub,
      body,
    );
  }
}
