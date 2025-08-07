import {
  BadRequestException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateAttendanceTypeDto } from '../dtos/create-attendance-type.dto';
import { IsNull, Repository } from 'typeorm';
import { AttendanceType } from '../attendance-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendanceTypesService {
  constructor(
    @InjectRepository(AttendanceType)
    private readonly attendanceTypesRepository: Repository<AttendanceType>,
  ) {}

  public async create(dto: CreateAttendanceTypeDto) {
    const existingAttendanceType = await this.fingOneByName(dto.name);

    if (existingAttendanceType) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        field: 'name',
        message: 'this name is already in use',
      });
    }

    const newAttendanceType = this.attendanceTypesRepository.create(dto);

    try {
      await this.attendanceTypesRepository.save(newAttendanceType);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async fingOneByName(name: string) {
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
}
