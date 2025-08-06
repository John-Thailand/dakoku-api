import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  current_email: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  new_email: string;
}
