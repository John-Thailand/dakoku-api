import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';
import { GetAdminMonthlyTasksRequestDto } from './dtos/get-admin-monthly-tasks-request.dto';
import { GetAdminMonthlyTasksResponseDto } from './dtos/get-admin-monthly-tasks-response.dto';
import { AdminMonthlyTask } from './admin-monthly-task.entity';
import { UpdateAdminMonthlyTaskStatus } from './dtos/update-admin-monthly-task-status.dto';

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

  @Patch(':id/status')
  @UseGuards(AuthGuard, AdminGuard)
  public updateAdminMonthlyTaskStatus(
    @Param('id') id: string,
    @Body() body: UpdateAdminMonthlyTaskStatus,
  ): Promise<AdminMonthlyTask> {
    return this.adminMonthlyTasksService.updateAdminMonthlyTaskStatus(id, body);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  public getAdminMonthlyTasks(
    @Query() query: GetAdminMonthlyTasksRequestDto,
  ): Promise<GetAdminMonthlyTasksResponseDto> {
    return this.adminMonthlyTasksService.getAdminMonthlyTasks(query);
  }
}
