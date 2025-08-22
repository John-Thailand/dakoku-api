import { Module } from '@nestjs/common';
import { AttendanceTypesService } from './providers/attendance-types.service';
import { AttendanceTypesController } from './attendance-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceType } from './attendance-type.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AttendanceTypesController],
  providers: [AttendanceTypesService],
  imports: [
    TypeOrmModule.forFeature([AttendanceType]),
    AuthModule,
    // jwtConfigをAuthModuleで使えるようにする
    ConfigModule.forFeature(jwtConfig),
    // ConfigServiceからjwtConfigを読み取る
    // そのjwtConfigをJwtModuleに渡す
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AttendanceTypesService],
})
export class AttendanceTypesModule {}
