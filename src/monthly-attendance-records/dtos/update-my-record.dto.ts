import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateMyRecordDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  attendance_type_id?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  start_time?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_time?: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'break_time must be in HH:mm format',
  })
  @IsOptional()
  break_time?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  job_description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  remarks?: string;
}
