import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  // Observable 複数の非同期データを扱えるストリーム型
  // next.handle()はObservableを返す。これに.pipe()を使用して処理の前後に割り込むことができる。
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    console.log('Im runnning before the handle', context);

    return handler.handle().pipe(
      map((data: any) => {
        console.log('Im running before response is sent out', data);

        // data: JSオブジェクト
        // オブジェクトからUserDtoクラスのインスタンスに変換
        // excludeExtraneousValues: true → @Expose()がついたプロパティだけを変換対象とする
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
