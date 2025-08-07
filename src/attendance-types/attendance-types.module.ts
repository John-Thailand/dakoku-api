import { Module } from '@nestjs/common';
import { AttendanceTypesService } from './providers/attendance-types.service';

@Module({
  providers: [AttendanceTypesService],
})
export class AttendanceTypesModule {}
