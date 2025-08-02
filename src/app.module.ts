import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

// 環境変数名（NODE_ENV）を取得
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    // TypeORMを使ってMySQLに接続するための初期設定
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
