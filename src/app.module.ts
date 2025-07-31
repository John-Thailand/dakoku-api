import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  // TypeORMを使ってMySQLに接続するための初期設定
  // TODO: MYSQLとの繋ぎこみ
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'app_user',
      password: 'app_password',
      database: 'app_db',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
