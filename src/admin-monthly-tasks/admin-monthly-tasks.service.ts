import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AdminMonthlyTask } from './admin-monthly-task.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateUtil } from 'src/utils/date.util';
import { GetAdminMonthlyTasksRequestDto } from './dtos/get-admin-monthly-tasks-request.dto';
import { GetAdminMonthlyTasksResponseDto } from './dtos/get-admin-monthly-tasks-response.dto';
import { UpdateAdminMonthlyTaskStatus } from './dtos/update-admin-monthly-task-status.dto';
import { AdminMonthlyTaskStatus } from './enums/admin-monthly-task-status.enum';
import { MonthlyAttendanceService } from 'src/monthly-attendance/monthly-attendance.service';
import { MonthlyAttendanceStatus } from 'src/monthly-attendance/enums/monthly-attendance-status.enum';

@Injectable()
export class AdminMonthlyTasksService {
  constructor(
    @InjectRepository(AdminMonthlyTask)
    private readonly adminMonthlyTasksRepository: Repository<AdminMonthlyTask>,
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
  ) {}

  public async createCurrentAdminMonthlyTask(): Promise<AdminMonthlyTask> {
    const targetMonth = DateUtil.getTargetMonthDate();
    const adminMonthlyTask = this.adminMonthlyTasksRepository.create({
      target_month: targetMonth,
    });

    try {
      return await this.adminMonthlyTasksRepository.save(adminMonthlyTask);
    } catch (error) {
      const code = error?.code;
      if (code === 'ER_DUP_ENTRY') {
        throw new ConflictException('admin monthly task already exists');
      }
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    // 該当の管理者月次タスクが存在するか確認
    let existingAdminMonthlyTask = undefined;
    try {
      existingAdminMonthlyTask =
        await this.adminMonthlyTasksRepository.findOneBy({
          id: id,
          deleted_at: IsNull(),
        });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!existingAdminMonthlyTask) {
      throw new NotFoundException('admin monthly task not found');
    }

    // 論理削除を実行
    existingAdminMonthlyTask.deleted_at = new Date();
    try {
      await this.adminMonthlyTasksRepository.save(existingAdminMonthlyTask);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async updateAdminMonthlyTaskStatus(
    id: string,
    body: UpdateAdminMonthlyTaskStatus,
  ): Promise<AdminMonthlyTask> {
    // 指定の管理者の月次タスクが存在するか確認する
    let existingAdminMonthlyTask: AdminMonthlyTask | undefined = undefined;
    try {
      existingAdminMonthlyTask =
        await this.adminMonthlyTasksRepository.findOneBy({
          id: id,
          deleted_at: IsNull(),
        });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!existingAdminMonthlyTask) {
      throw new NotFoundException('admin monthly task not found');
    }

    // PENDING -> SUBMIT_ATTENDANCE_SHEETへ更新することはできない
    // 必ずPENDINC -> CLOSE_ATTENDANCE -> SUBMIT_ATTENDANCE_SHEETの順で更新する必要がある
    if (
      existingAdminMonthlyTask.status === AdminMonthlyTaskStatus.PENDING &&
      body.status === AdminMonthlyTaskStatus.SUBMIT_ATTENDANCE_SHEET
    ) {
      throw new BadRequestException(
        'can not update status from pending to submit_attendance_sheet',
      );
    }

    // ◯◯◯ -> CLOSE_ATTENDANCEに更新する場合、その年月の勤怠締を全て完了しているか確認する
    if (
      existingAdminMonthlyTask.status !==
        AdminMonthlyTaskStatus.CLOSE_ATTENDANCE &&
      body.status === AdminMonthlyTaskStatus.CLOSE_ATTENDANCE
    ) {
      const targetMonth = existingAdminMonthlyTask.target_month;
      const monthlyAttendance =
        await this.monthlyAttendanceService.getMonthlyAttendanceByTargetMonth(
          targetMonth,
        );
      const isAllCloseAttendance = monthlyAttendance.every(
        (item) => item.status === MonthlyAttendanceStatus.ADMIN_CLOSED,
      );

      if (!isAllCloseAttendance) {
        // 状態制約を満たさない入力なので、422エラーを返す
        throw new UnprocessableEntityException(
          'all monthly attendance must be admin_closed before updating to close_attendance',
        );
      }
    }

    // ステータスを更新する
    existingAdminMonthlyTask.status = body.status;
    try {
      return await this.adminMonthlyTasksRepository.save(
        existingAdminMonthlyTask,
      );
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async getAdminMonthlyTasks(
    query: GetAdminMonthlyTasksRequestDto,
  ): Promise<GetAdminMonthlyTasksResponseDto> {
    let queryBuilder = this.adminMonthlyTasksRepository
      .createQueryBuilder('amt')
      .where('amt.deleted_at IS NULL');

    if (query.target_month) {
      const targetMonth = DateUtil.convertTextToDate(query.target_month);
      queryBuilder = queryBuilder.andWhere('amt.target_month = :targetMonth', {
        targetMonth,
      });
    }

    const order = query.order.toUpperCase() as 'ASC' | 'DESC';
    queryBuilder = queryBuilder.orderBy(query.order_by, order);

    const allCount = await queryBuilder.getCount();

    queryBuilder = queryBuilder
      .limit(query.page_size)
      .offset((query.page - 1) * query.page_size);

    const adminMonthlyTasks = await queryBuilder.getMany();

    return {
      admin_monthly_tasks: adminMonthlyTasks,
      total: allCount,
    };
  }
}
