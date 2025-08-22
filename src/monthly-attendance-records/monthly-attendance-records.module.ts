import { Module } from '@nestjs/common';
import { MonthlyAttendanceRecordsController } from './monthly-attendance-records.controller';
import { MonthlyAttendanceRecordsService } from './monthly-attendance-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAttendanceRecord } from './monthly-attendance-record.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MonthlyAttendanceModule } from 'src/monthly-attendance/monthly-attendance.module';
import { AttendanceTypesModule } from 'src/attendance-types/attendance-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthlyAttendanceRecord]),
    AuthModule,
    UsersModule,
    // jwtConfigをAuthModuleで使えるようにする
    ConfigModule.forFeature(jwtConfig),
    // ConfigServiceからjwtConfigを読み取る
    // そのjwtConfigをJwtModuleに渡す
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MonthlyAttendanceModule,
    AttendanceTypesModule,
  ],
  controllers: [MonthlyAttendanceRecordsController],
  providers: [MonthlyAttendanceRecordsService],
})
export class MonthlyAttendanceRecordsModule {}
