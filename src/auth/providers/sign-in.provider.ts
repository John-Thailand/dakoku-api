import { UsersService } from 'src/users/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { GenerateTokensProvider } from './generate-tokens.provider';

export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // 入力されたメールアドレスのユーザーを検索
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // もしそのユーザーが存在しなければエラーを返す
    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }

    // 次に入力されたパスワードとハッシュ化したユーザーを検証する
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'could not compare passwords',
      });
    }

    // もしパスワードが正しくなければエラーを返す
    if (!isEqual) {
      throw new UnauthorizedException('incorrect password or email');
    }

    // メール認証していない場合はエラーを返す
    // メール認証済みであることを事前条件（Precondition）にしている
    // それが満たされない場合、412 Precondition Failedエラーを返す
    if (!user.is_email_verified) {
      throw new HttpException(
        'email not verified',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    // アクセストークンとリフレッシュトークンを返す
    return await this.generateTokensProvider.generateTokens(user);
  }
}
