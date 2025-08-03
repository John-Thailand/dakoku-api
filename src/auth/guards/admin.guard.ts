import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/constants';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // リクエストを取得
    const request = context.switchToHttp().getRequest();
    // リクエストからユーザー情報を取得
    const user = request[REQUEST_USER_KEY];

    // ユーザーが存在しない または 管理者フラグがfalseの場合、認可NG
    if (!user || !user.is_administrator) {
      // The HTTP response status code will be 403.
      throw new ForbiddenException();
    }

    return true;
  }
}
