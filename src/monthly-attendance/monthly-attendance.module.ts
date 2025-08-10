import { Module } from '@nestjs/common';
import { MonthlyAttendanceController } from './monthly-attendance.controller';
import { MonthlyAttendanceService } from './monthly-attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAttendance } from './monthly-attendance.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyAttendance, User])],
  controllers: [MonthlyAttendanceController],
  providers: [MonthlyAttendanceService],
  exports: [MonthlyAttendanceService],
})
export class MonthlyAttendanceModule {}
