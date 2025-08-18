import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';

@Controller('admin-monthly-tasks')
export class AdminMonthlyTasksController {
  constructor(
    private readonly adminMonthlyTasksService: AdminMonthlyTasksService,
  ) {}

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(204)
  public deleteAdminMonthlyTask(@Param('id') id: string): Promise<void> {
    return this.adminMonthlyTasksService.delete(id);
  }
}
