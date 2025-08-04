import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import mailConfig from './config/mail.config';

// 環境変数名（NODE_ENV）を取得
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigModuleをアプリケーション全体でグローバルに利用可能にするため
      // 各モジュールでConfigModuleを毎回importsしなくてよい
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      // カスタム設定ファイルを読み込む
      load: [databaseConfig, mailConfig],
      validationSchema: environmentValidation,
    }),
    // TypeORMを使ってMySQLに接続するための初期設定
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        // entities: [User],
        // @Entityを自動で読み込む設定 => entitiesにエンティティを羅列する必要がない
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
      }),
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
