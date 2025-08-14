import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserMonthlyAttendanceParam {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}
