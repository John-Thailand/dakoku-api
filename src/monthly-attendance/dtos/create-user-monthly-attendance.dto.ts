import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsMoreThanServiceStartedYear } from '../validators/is_more_than_service_started_year.validator';

export class CreateUserMonthlyAttendanceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'target month format is yyyy-MM',
  })
  @IsMoreThanServiceStartedYear()
  target_month: string;
}
