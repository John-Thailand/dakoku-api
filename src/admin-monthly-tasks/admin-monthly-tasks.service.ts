import { ConflictException, Injectable } from '@nestjs/common';
import { AdminMonthlyTask } from './admin-monthly-task.entity';
import { Repository } from 'typeorm';
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
}
