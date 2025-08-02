import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { UsersModule } from 'src/users/users.module';

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
    SignInProvider,
  ],
  // AuthModuleとUsersModuleどちらも循環依存があると、importでエラーになる
  // この依存は後で解決されるから、一旦forwardRefで仮に保持しておいて
  imports: [forwardRef(() => UsersModule)],
  exports: [HashingProvider],
})
export class AuthModule {}
