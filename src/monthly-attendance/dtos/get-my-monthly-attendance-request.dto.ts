import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { IsMoreThanServiceStartedYear } from '../validators/is_more_than_service_started_year.validator';
import { Type } from 'class-transformer';

export class GetMyMonthlyAttendanceRequestDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'target month format is yyyy-MM',
  })
  @IsMoreThanServiceStartedYear()
  @IsOptional()
  target_month?: string;

  @IsString()
  @IsIn(['target_month', 'created_at', 'updated_at'])
  @IsOptional()
  order_by?: 'target_month' | 'created_at' | 'updated_at' = 'target_month';

  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order?: 'desc' | 'asc' = 'desc';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page_size?: number = 50;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;
}
