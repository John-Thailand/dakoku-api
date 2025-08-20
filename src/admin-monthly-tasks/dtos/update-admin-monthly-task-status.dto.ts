import { IsEnum, IsNotEmpty } from 'class-validator';
import { AdminMonthlyTaskStatus } from '../enums/admin-monthly-task-status.enum';

export class UpdateAdminMonthlyTaskStatus {
  @IsEnum(AdminMonthlyTaskStatus)
  @IsNotEmpty()
  status: AdminMonthlyTaskStatus;
}
