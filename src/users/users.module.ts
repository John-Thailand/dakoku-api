import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { MonthlyAttendance } from 'src/monthly-attendance/monthly-attendance.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, MonthlyAttendance]),
    AuthModule,
    // jwtConfigをAuthModuleで使えるようにする
    ConfigModule.forFeature(jwtConfig),
    // ConfigServiceからjwtConfigを読み取る
    // そのjwtConfigをJwtModuleに渡す
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
