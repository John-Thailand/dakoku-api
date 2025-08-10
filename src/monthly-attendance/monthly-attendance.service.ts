import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MonthlyAttendance } from './monthly-attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { DateUtil } from 'src/utils/date.util';

@Injectable()
export class MonthlyAttendanceService {
  constructor(
    @InjectRepository(MonthlyAttendance)
    private readonly monthlyAttendanceRepository: Repository<MonthlyAttendance>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  public async createMonthlyAttendanceForThisMonth(): Promise<
    MonthlyAttendance[]
  > {
    const newMonthlyAttendanceList: MonthlyAttendance[] = [];

    // 一般ユーザー かつ 削除されていないユーザーを取得
    const targetMonth = DateUtil.getTargetMonthText();
    const generalActiveUsers = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect(
        'u.monthly_attendance',
        'ma',
        'ma.target_month = :targetMonth AND ma.deleted_at IS NULL',
        { targetMonth },
      )
      .where('u.is_administrator = :isAdmin', { isAdmin: false })
      .andWhere('u.deleted_at IS NULL')
      .getMany();

    // それらのユーザーの今月の月次勤怠を作成
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (const generalActiveUser of generalActiveUsers) {
        if (generalActiveUser.monthly_attendance.length === 0) {
          const newMonthlyAttendance = this.monthlyAttendanceRepository.create({
            user: generalActiveUser,
            target_month: DateUtil.getTargetMonthDate(),
          });
          const result =
            await this.monthlyAttendanceRepository.save(newMonthlyAttendance);
          newMonthlyAttendanceList.push(result);
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error.code),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newMonthlyAttendanceList;
  }
}
