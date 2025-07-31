import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // HashingProviderを依存注入できる
    // 実際にインスタンス化されるのはBcryptProvider
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [HashingProvider],
})
export class AuthModule {}
