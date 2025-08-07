import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAttendanceTypeDto } from './dtos/create-attendance-type.dto';
import { AttendanceTypesService } from './providers/attendance-types.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('attendance-types')
export class AttendanceTypesController {
  constructor(
    private readonly attendanceTypesService: AttendanceTypesService,
  ) {}

  // TODO: 勤怠タイプのCreate
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  public createAttendanceType(@Body() body: CreateAttendanceTypeDto) {
    return this.attendanceTypesService.create(body);
  }

  // TODO: 勤怠タイプのUpdate
  // TODO: 勤怠タイプのDelete
  // TODO: 勤怠タイプの全件Get
}
