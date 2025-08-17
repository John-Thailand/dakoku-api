import { Module } from '@nestjs/common';
import { BatchProcessingController } from './batch-processing.controller';
import { BatchProcessingService } from './providers/batch-processing.service';
import { MonthlyAttendanceModule } from 'src/monthly-attendance/monthly-attendance.module';
import { AdminMonthlyTasksModule } from 'src/admin-monthly-tasks/admin-monthly-tasks.module';

@Module({
  imports: [MonthlyAttendanceModule, AdminMonthlyTasksModule],
  controllers: [BatchProcessingController],
  providers: [BatchProcessingService],
})
export class BatchProcessingModule {}
