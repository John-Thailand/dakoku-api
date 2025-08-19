import { AdminMonthlyTask } from '../admin-monthly-task.entity';

export class GetAdminMonthlyTasksResponseDto {
  admin_monthly_tasks: AdminMonthlyTask[];

  total: number;
}
