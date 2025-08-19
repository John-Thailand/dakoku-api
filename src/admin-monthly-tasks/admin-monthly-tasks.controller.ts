import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';
import { GetAdminMonthlyTasksRequestDto } from './dtos/get-admin-monthly-tasks-request.dto';
import { GetAdminMonthlyTasksResponseDto } from './dtos/get-admin-monthly-tasks-response.dto';

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

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  public getAdminMonthlyTasks(
    @Query() query: GetAdminMonthlyTasksRequestDto,
  ): Promise<GetAdminMonthlyTasksResponseDto> {
    return this.adminMonthlyTasksService.getAdminMonthlyTasks(query);
  }
}
