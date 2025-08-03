import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // 余計なプロパティが含まれている場合、そのプロパティをリクエストから除外する
      whitelist: true,
      // 余計なプロパティが含まれている場合、400 Bad Requestを返す
      forbidNonWhitelisted: true,
      // @Transformがうまく動作するために必要
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
