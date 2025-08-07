import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAttendanceTypeDto } from './dtos/create-attendance-type.dto';
import { AttendanceTypesService } from './providers/attendance-types.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AttendanceType } from './attendance-type.entity';

@Controller('attendance-types')
export class AttendanceTypesController {
  constructor(
    private readonly attendanceTypesService: AttendanceTypesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  public createAttendanceType(
    @Body() body: CreateAttendanceTypeDto,
  ): Promise<AttendanceType> {
    return this.attendanceTypesService.create(body);
  }

  // TODO: 勤怠タイプのUpdate

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(204)
  public deleteAttendanceType(@Param('id') id: string): Promise<void> {
    return this.attendanceTypesService.delete(id);
  }

  // TODO: 勤怠タイプの全件Get
}
