import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateAttendanceTypeDto } from './dtos/create-attendance-type.dto';
import { AttendanceTypesService } from './providers/attendance-types.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AttendanceType } from './attendance-type.entity';
import { UpdateAttendanceTypeDto } from './dtos/update-attendance-type.dto';

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

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  public updateAttendanceType(
    @Param('id') id: string,
    @Body() body: UpdateAttendanceTypeDto,
  ): Promise<AttendanceType> {
    return this.attendanceTypesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(204)
  public deleteAttendanceType(@Param('id') id: string): Promise<void> {
    return this.attendanceTypesService.delete(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  public getAttendanceTypes(): Promise<AttendanceType[]> {
    return this.attendanceTypesService.findAll();
  }
}
