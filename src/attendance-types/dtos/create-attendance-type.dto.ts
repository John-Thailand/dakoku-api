import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAttendanceTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name: string;
}
