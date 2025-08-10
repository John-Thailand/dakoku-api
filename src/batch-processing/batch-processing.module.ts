import { Module } from '@nestjs/common';
import { BatchProcessingController } from './batch-processing.controller';
import { BatchProcessingService } from './providers/batch-processing.service';
import { MonthlyAttendanceModule } from 'src/monthly-attendance/monthly-attendance.module';

@Module({
  imports: [MonthlyAttendanceModule],
  controllers: [BatchProcessingController],
  providers: [BatchProcessingService],
})
export class BatchProcessingModule {}
