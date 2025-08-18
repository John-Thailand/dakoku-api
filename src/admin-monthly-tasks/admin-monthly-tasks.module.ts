import { Module } from '@nestjs/common';
import { AdminMonthlyTasksService } from './admin-monthly-tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMonthlyTask } from './admin-monthly-task.entity';
import { AdminMonthlyTasksController } from './admin-monthly-tasks.controller';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminMonthlyTask]),
    // jwtConfigをAuthModuleで使えるようにする
    ConfigModule.forFeature(jwtConfig),
    // ConfigServiceからjwtConfigを読み取る
    // そのjwtConfigをJwtModuleに渡す
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [AdminMonthlyTasksService],
  exports: [AdminMonthlyTasksService],
  controllers: [AdminMonthlyTasksController],
})
export class AdminMonthlyTasksModule {}
