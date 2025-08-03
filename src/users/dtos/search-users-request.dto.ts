import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchUsersRequestDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsBoolean()
  // 'true'や'1'などの値をリクエストから受け取るので、それをbooleanのtrueやfalseに変換する
  @Transform(({ value }) => value === 'true' || value === '1')
  @IsOptional()
  include_administrators: boolean = false;

  @IsString()
  @IsIn(['created_at', 'updated_at'])
  @IsOptional()
  order_by: 'created_at' | 'updated_at' = 'created_at';

  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page_size: number = 50;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page: number = 0;
}
