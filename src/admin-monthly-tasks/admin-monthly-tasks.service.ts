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
}
