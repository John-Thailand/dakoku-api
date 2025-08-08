import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateAttendanceTypeDto } from '../dtos/create-attendance-type.dto';
import { IsNull, Repository } from 'typeorm';
import { AttendanceType } from '../attendance-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAttendanceTypeDto } from '../dtos/update-attendance-type.dto';

@Injectable()
export class AttendanceTypesService {
  constructor(
    @InjectRepository(AttendanceType)
    private readonly attendanceTypesRepository: Repository<AttendanceType>,
  ) {}

  public async create(dto: CreateAttendanceTypeDto): Promise<AttendanceType> {
    // すでに同じ名前の勤怠タイプがないか確認
    const existingAttendanceType = await this.findOneByName(dto.name);

    // もし同じ名前の勤怠タイプが存在する場合、エラーを返す
    if (existingAttendanceType) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        field: 'name',
        message: 'this name is already in use',
      });
    }

    // 新しい勤怠タイプを作成
    const newAttendanceType = this.attendanceTypesRepository.create(dto);

    try {
      return await this.attendanceTypesRepository.save(newAttendanceType);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async update(
    id: string,
    dto: UpdateAttendanceTypeDto,
  ): Promise<AttendanceType> {
    // 更新対象の勤怠タイプが存在するか確認
    const targetAttendanceType = await this.findOneById(id);

    // もし存在しなければエラーを返す
    if (!targetAttendanceType) {
      throw new NotFoundException('this attendance type does not exist');
    }

    // 更新後の名前の勤怠タイプがすでに存在するか確認
    const duplicateAttendanceType = await this.findOneByName(dto.name);

    // もし存在していればエラーを返す
    if (
      duplicateAttendanceType &&
      targetAttendanceType.id !== duplicateAttendanceType.id
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        field: 'name',
        message: 'this name is already in use',
      });
    }

    // 勤怠タイプを更新
    targetAttendanceType.name = dto.name;
    try {
      return await this.attendanceTypesRepository.save(targetAttendanceType);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async delete(id: string): Promise<void> {
    // 削除対象の勤怠タイプが存在するか確認
    const existingAttendanceType = await this.findOneById(id);

    // もし勤怠タイプが存在しない場合、エラーを返す
    if (!existingAttendanceType) {
      throw new NotFoundException('this attendance type does not exist');
    }

    // 勤怠タイプを論理削除する
    existingAttendanceType.deleted_at = new Date();
    try {
      await this.attendanceTypesRepository.save(existingAttendanceType);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async findAll(): Promise<AttendanceType[]> {
    try {
      const attendanceTypes = await this.attendanceTypesRepository.findBy({
        deleted_at: IsNull(),
      });
      return attendanceTypes;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async findOneByName(name: string) {
    try {
      const attendanceType = await this.attendanceTypesRepository.findOneBy({
        name,
        deleted_at: IsNull(),
      });
      return attendanceType;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async findOneById(id: string) {
    try {
      const attendanceType = await this.attendanceTypesRepository.findOneBy({
        id,
        deleted_at: IsNull(),
      });
      return attendanceType;
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
