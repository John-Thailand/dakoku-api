import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  // 認証トークンなど文字列ではなくランダムなバイナリ列をハッシュしたい場合がある
  // そういった場合も対応できるように、Bufferも引数の型としている
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
