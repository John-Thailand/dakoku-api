import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { MonthlyAttendanceService } from 'src/monthly-attendance/monthly-attendance.service';
import { DateUtil } from 'src/utils/date.util';
import { IsNull, Repository } from 'typeorm';
import { MonthlyAttendanceRecord } from './monthly-attendance-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceTypesService } from 'src/attendance-types/providers/attendance-types.service';
import { ATTENDANCE_AT_WORK } from 'src/attendance-types/constants/constants';

@Injectable()
export class MonthlyAttendanceRecordsService {
  constructor(
    private readonly monthlyAttendanceService: MonthlyAttendanceService,
    private readonly attendanceTypesService: AttendanceTypesService,
    @InjectRepository(MonthlyAttendanceRecord)
    private readonly monthlyAttendanceRecordsRepository: Repository<MonthlyAttendanceRecord>,
  ) {}

  public async updateWorkRecord(userId: string) {
    // 指定の月次勤怠が存在しているか確認する
    const now = new Date();
    const targetMonth = DateUtil.getTargetMonthDate(now);
    const existingMonthlyAttendance =
      await this.monthlyAttendanceService.findOneByUserIdAndTargetMonth(
        userId,
        targetMonth,
      );

    // 指定の月次勤怠が存在しない場合、エラーを返す
    if (!existingMonthlyAttendance) {
      throw new NotFoundException('monthly attendance not found');
    }

    // 指定の月次勤怠レコードが存在しているか確認する
    const date = DateUtil.getTodayStartUtc(now);
    const existingMonthlyAttendanceRecord =
      await this.findOneByMonthlyAttendanceIdAndDate(
        existingMonthlyAttendance.id,
        date,
      );

    // 出勤タイプIDを取得
    const attendanceAtWork =
      await this.attendanceTypesService.findOneByName(ATTENDANCE_AT_WORK);

    // もし出勤のタイプが存在しない場合、エラーを返す
    if (!attendanceAtWork) {
      throw new NotFoundException('attendance at work not found');
    }

    // 指定の月次勤怠が出勤タイプでなければ、更新することはできない
    if (
      existingMonthlyAttendanceRecord.attendance_type_id !== attendanceAtWork.id
    ) {
      throw new BadRequestException('you can update attendance at work');
    }

    // 指定の月次勤怠レコードのend_timeを更新する
    existingMonthlyAttendanceRecord.end_time = now;
    try {
      return await this.monthlyAttendanceRecordsRepository.save(
        existingMonthlyAttendanceRecord,
      );
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }

  public async createWorkRecord(userId: string) {
    // 指定の月次勤怠が存在しているか確認する
    const now = new Date();
    const targetMonth = DateUtil.getTargetMonthDate(now);
    const existingMonthlyAttendance =
      await this.monthlyAttendanceService.findOneByUserIdAndTargetMonth(
        userId,
        targetMonth,
      );

    // 指定の月次勤怠が存在しない場合、エラーを返す
    if (!existingMonthlyAttendance) {
      throw new NotFoundException('monthly attendance not found');
    }

    // 出勤タイプIDを取得
    const attendanceAtWork =
      await this.attendanceTypesService.findOneByName(ATTENDANCE_AT_WORK);

    // もし出勤のタイプが存在しない場合、エラーを返す
    if (!attendanceAtWork) {
      throw new NotFoundException('attendance at work not found');
    }

    // 出勤したデータをDBに追加
    const jstDate = DateUtil.getTargetDate(now);
    const monthlyAttendanceRecord =
      this.monthlyAttendanceRecordsRepository.create({
        monthly_attendance_id: existingMonthlyAttendance.id,
        attendance_type_id: attendanceAtWork.id,
        date: jstDate,
        start_time: now,
      });
    try {
      return await this.monthlyAttendanceRecordsRepository.save(
        monthlyAttendanceRecord,
      );
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }

  public async findOneByMonthlyAttendanceIdAndDate(
    id: string,
    date: Date,
  ): Promise<MonthlyAttendanceRecord> {
    let existingMonthlyAttendanceRecord: MonthlyAttendanceRecord | undefined =
      undefined;

    try {
      existingMonthlyAttendanceRecord =
        await this.monthlyAttendanceRecordsRepository.findOneBy({
          monthly_attendance_id: id,
          date: date,
          deleted_at: IsNull(),
        });
    } catch (error) {
      throw new RequestTimeoutException();
    }

    if (!existingMonthlyAttendanceRecord) {
      throw new NotFoundException('monthly attendance record not found');
    }

    return existingMonthlyAttendanceRecord;
  }
}
