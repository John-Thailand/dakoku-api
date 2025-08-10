import { Module } from '@nestjs/common';
import { MonthlyAttendanceController } from './monthly-attendance.controller';
import { MonthlyAttendanceService } from './monthly-attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAttendance } from './monthly-attendance.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthlyAttendance, User]),
    AuthModule,
    // jwtConfigをAuthModuleで使えるようにする
    ConfigModule.forFeature(jwtConfig),
    // ConfigServiceからjwtConfigを読み取る
    // そのjwtConfigをJwtModuleに渡す
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [MonthlyAttendanceController],
  providers: [MonthlyAttendanceService],
  exports: [MonthlyAttendanceService],
})
export class MonthlyAttendanceModule {}
