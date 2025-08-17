import { Module } from '@nestjs/common';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMonthlyTask } from './admin-monthly-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminMonthlyTask])],
  providers: [AdminMonthlyTasksService],
  exports: [AdminMonthlyTasksService],
})
export class AdminMonthlyTasksModule {}
