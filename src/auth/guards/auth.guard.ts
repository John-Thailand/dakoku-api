import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
// ExpressのHTTPリクエストオブジェクトを使うため
// NestJSはデフォルトでHTTP通信の基盤としてExpressを使用しています
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // リクエストを取得
    const request = context.switchToHttp().getRequest();
    // ヘッダーからアクセストークンを取得
    const token = this.extractRequestFromHeader(request);
    // トークンが空であればエラーを返す
    if (!token) {
      throw new UnauthorizedException();
    }

    // 与えられたトークンが正しいかチェック
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      console.log(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
