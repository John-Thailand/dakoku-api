import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class VerifyEmailProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    let userId: string | undefined = undefined;
    let user: User | undefined = undefined;

    try {
      // トークンの検証
      const { sub } = await this.jwtService.verifyAsync(verifyEmailDto.token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      userId = sub;
    } catch (error) {
      throw new BadRequestException('token is invalid');
    }

    try {
      // IDからユーザーを検索
      user = await this.usersService.findOneById(userId);
    } catch (error) {
      throw new RequestTimeoutException();
    }

    try {
      // メール認証をtrueに更新
      await this.usersService.updateEmailVerified(user);
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }
}
