// bcryptパッケージ内の全てのエクスポートをオブジェクトとしてまとめて、bcryptという名前でimportしている
import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
