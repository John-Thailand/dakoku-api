import { Module } from '@nestjs/common';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';

@Module({
  providers: [AdminMonthlyTasksService],
})
export class AdminMonthlyTasksModule {}
