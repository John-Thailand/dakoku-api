import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    // ConfigModule経由で読み込まれたJWT関連の設定値を注入する
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      // payload
      {
        sub: userId,
        ...payload,
      },
      // options
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateEmailVerifiedToken(user: User): Promise<string> {
    const token = await this.signToken<Partial<ActiveUserData>>(
      user.id,
      this.jwtConfiguration.accessTokenTtl,
      {
        email: user.email,
        is_administrator: user.is_administrator,
      },
    );
    return token;
  }

  public async generateTokens(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      // アクセストークンの生成
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          is_administrator: user.is_administrator,
        },
      ),
      // リフレッシュトークンの生成
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
