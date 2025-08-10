import { Expose, Transform } from 'class-transformer';

export class MonthlyAttendanceDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  user_id: string;

  @Expose()
  target_month: Date;

  @Expose()
  status: MonthlyAttendanceDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at: Date | null;
}
