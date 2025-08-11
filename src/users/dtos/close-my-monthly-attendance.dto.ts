import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CloseMyMonthlyAttendanceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'target month format is yyyy-MM',
  })
  target_month: string;
}
