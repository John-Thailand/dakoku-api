import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { MonthlyAttendance } from './monthly-attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { DateUtil } from 'src/utils/date.util';
import { CloseMyMonthlyAttendanceParamDto } from 'src/monthly-attendance/dtos/close-my-monthly-attendance-param.dto';
import { UsersService } from 'src/users/users.service';
import { MonthlyAttendanceStatus } from './enums/monthly-attendance-status.enum';
import { UpdateUserMonthlyAttendanceStatusParam } from './dtos/update-user-monthly-attendance-status-param.dto';
import { UpdateUserMonthlyAttendanceStatus } from './dtos/update-user-monthly-attendance-status.dto';
import { DeleteUserMonthlyAttendanceParam } from './dtos/delete-user-monthly-attendance-param.dto';

@Injectable()
export class MonthlyAttendanceService {
  constructor(
    @InjectRepository(MonthlyAttendance)
    private readonly monthlyAttendanceRepository: Repository<MonthlyAttendance>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
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

  public async deleteUserMonthlyAttendance(
    param: DeleteUserMonthlyAttendanceParam,
  ): Promise<void> {
    // ユーザーが存在するか確認
    const existingUser = await this.usersService.findOneById(param.user_id);

    // 該当ユーザーの該当年月の月次勤怠が存在するか確認
    const targetMonth = DateUtil.convertTextToDate(param.target_month);
    const existingMonthlyAttendance = await this.findOneByUserIdAndTargetMonth(
      existingUser.id,
      targetMonth,
    );

    // 月次勤怠を削除
    existingMonthlyAttendance.deleted_at = new Date();
    try {
      await this.monthlyAttendanceRepository.save(existingMonthlyAttendance);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async closeMyMonthlyAttendance(
    userId: string,
    dto: CloseMyMonthlyAttendanceParamDto,
  ): Promise<MonthlyAttendance> {
    // ユーザーが存在するか確認
    const existingUser = await this.usersService.findOneById(userId);

    // 該当ユーザーの該当年月の月次勤怠が存在するか確認
    const targetMonth = DateUtil.convertTextToDate(dto.target_month);
    const existingMonthlyAttendance = await this.findOneByUserIdAndTargetMonth(
      existingUser.id,
      targetMonth,
    );

    // ユーザーの月次勤怠締めを実行
    existingMonthlyAttendance.status = MonthlyAttendanceStatus.USER_CLOSED;
    try {
      return await this.monthlyAttendanceRepository.save(
        existingMonthlyAttendance,
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

  public async updateUserMonthlyAttendanceStatus(
    param: UpdateUserMonthlyAttendanceStatusParam,
    body: UpdateUserMonthlyAttendanceStatus,
  ): Promise<MonthlyAttendance> {
    // ユーザーが存在するか確認
    const existingUser = await this.usersService.findOneById(param.user_id);

    if (existingUser.is_administrator) {
      throw new BadRequestException(
        'Administrators do not have monthly attendance',
      );
    }

    // 対象の月次勤怠が存在するか確認
    const targetMonth = DateUtil.convertTextToDate(param.target_month);
    const existingMonthlyAttendance = await this.findOneByUserIdAndTargetMonth(
      existingUser.id,
      targetMonth,
    );

    // 月次勤怠を更新
    existingMonthlyAttendance.status = body.status;
    try {
      return await this.monthlyAttendanceRepository.save(
        existingMonthlyAttendance,
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

  public async findOneByUserIdAndTargetMonth(
    userId: string,
    targetMonth: Date,
  ): Promise<MonthlyAttendance> {
    let monthlyAttendance: MonthlyAttendance | undefined = undefined;

    try {
      monthlyAttendance = await this.monthlyAttendanceRepository.findOneBy({
        user_id: userId,
        target_month: targetMonth,
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

    if (!monthlyAttendance) {
      throw new NotFoundException('this monthly attendance not found');
    }

    return monthlyAttendance;
  }
}
