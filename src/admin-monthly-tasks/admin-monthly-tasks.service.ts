import {
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { AdminMonthlyTask } from './admin-monthly-task.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateUtil } from 'src/utils/date.util';
import { GetAdminMonthlyTasksRequestDto } from './dtos/get-admin-monthly-tasks-request.dto';
import { GetAdminMonthlyTasksResponseDto } from './dtos/get-admin-monthly-tasks-response.dto';

@Injectable()
export class AdminMonthlyTasksService {
  constructor(
    @InjectRepository(AdminMonthlyTask)
    private readonly adminMonthlyTasksRepository: Repository<AdminMonthlyTask>,
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
