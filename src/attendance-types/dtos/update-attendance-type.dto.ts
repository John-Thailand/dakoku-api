import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAttendanceTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name: string;
}
