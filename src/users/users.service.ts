import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { IsNull, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { PatchUserDto } from './dtos/patch-user.dto';
import { SearchUsersRequestDto } from './dtos/search-users-request.dto';
import { SearchUsersResponseDto } from './dtos/search-users-response.dto';
import { MailService } from 'src/mail/providers/mail.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
    private readonly mailService: MailService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser = undefined;

    // メールアドレスでユーザーを検索する
    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
          deleted_at: IsNull(),
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // 既にユーザーが存在している場合、エラーを返す
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    // ユーザーを登録する
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Welcomeメールを送信
    try {
      const token =
        await this.generateTokensProvider.generateEmailVerifiedToken(newUser);
      await this.mailService.sendUserWelcome(newUser, token);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newUser;
  }

  public async patchUser(
    userId: string,
    patchUserDto: PatchUserDto,
  ): Promise<User> {
    let existingUser = undefined;

    // ユーザーIDで更新対象のユーザーを検索
    try {
      existingUser = await this.usersRepository.findOneBy({
        id: userId,
        deleted_at: IsNull(),
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // 更新対象が存在しなければエラーを返す
    if (!existingUser) {
      throw new BadRequestException('user not found');
    }

    // 指定されたメールでユーザーを検索する
    let existingEmailUser = undefined;
    if (patchUserDto.email) {
      try {
        existingEmailUser = await this.usersRepository.findOneBy({
          email: patchUserDto.email,
          deleted_at: IsNull(),
        });
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment please try later',
          {
            description: 'Error connecting to the database',
          },
        );
      }
    }

    // すでに使用されているメールであれば、エラーを返す
    if (existingEmailUser) {
      throw new BadRequestException('the email is already used');
    }

    // ユーザーを更新する
    existingUser.name = patchUserDto.name ?? existingUser.name;
    existingUser.email = patchUserDto.email ?? existingUser.email;
    if (patchUserDto.password) {
      existingUser.password = await this.hashingProvider.hashPassword(
        patchUserDto.password,
      );
    }

    try {
      await this.usersRepository.save(existingUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return existingUser;
  }

  public async deleteUser(userId: string): Promise<void> {
    let existingUser = undefined;

    // ユーザーIDで削除対象のユーザーを検索
    try {
      existingUser = await this.usersRepository.findOneBy({
        id: userId,
        // TypeOrmのIsNullで論理削除されていないか確認
        // Find Options Operator. Example: { someField: IsNull() }
        deleted_at: IsNull(),
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // 削除対象が存在しなければエラーを返す
    if (!existingUser) {
      throw new NotFoundException('user not found');
    }

    // ユーザーを論理削除する
    existingUser.deleted_at = new Date();
    try {
      await this.usersRepository.save(existingUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.findOneBy({
        email: email,
        deleted_at: IsNull(),
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    return user;
  }

  public async findOneById(id: string): Promise<User> {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({
        id,
        deleted_at: IsNull(),
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('the user does not exist');
    }

    return user;
  }

  public async searchUsers(
    dto: SearchUsersRequestDto,
  ): Promise<SearchUsersResponseDto> {
    let query = this.usersRepository
      .createQueryBuilder()
      .where('deleted_at IS NULL');

    if (dto.name) {
      query = query.andWhere('name LIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto.email) {
      query = query.andWhere('email LIKE :email', {
        email: `%${dto.email}%`,
      });
    }

    if (dto.include_administrators === false) {
      query = query.andWhere('is_administrator = false');
    }

    const order = dto.order.toUpperCase() as 'ASC' | 'DESC';
    query = query.orderBy(dto.order_by, order);

    const allCount = await query.getCount();

    query = query.limit(dto.page_size).offset((dto.page - 1) * dto.page_size);

    const users = await query.getMany();

    return {
      users,
      total: allCount,
    };
  }

  public async updateEmailVerified(user: User) {
    user.is_email_verified = true;
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const existingUser = await this.findOneById(id);

    // 入力されたパスワードとハッシュ化したユーザーを検証する
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        updatePasswordDto.current_password,
        existingUser.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'could not compare password',
      });
    }

    // もしパスワードが正しくなければエラーを返す
    if (!isEqual) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        field: 'current_password',
        message: 'incorrect current password',
      });
    }

    // 新しいパスワードと新しい確認用のパスワードが一致していない場合、エラーを返す
    if (
      updatePasswordDto.new_password !==
      updatePasswordDto.new_password_confirmation
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        field: 'new_password_confirmation',
        message: 'new password and new confirmation password do not match',
      });
    }

    // 現在のパスワードと新しいパスワードが同じ場合、エラーを返す
    if (updatePasswordDto.current_password === updatePasswordDto.new_password) {
      throw new BadRequestException(
        'new password must be different from current password',
      );
    }

    // パスワードを更新
    existingUser.password = await this.hashingProvider.hashPassword(
      updatePasswordDto.new_password,
    );

    try {
      await this.usersRepository.save(existingUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return existingUser;
  }

  public async updateEmail(userId: string, updateEmailDto: UpdateEmailDto) {
    const requestUser = await this.findOneById(userId);

    // 入力された現在のパスワードが正しいかチェックする
    if (requestUser.email !== updateEmailDto.current_email) {
      throw new BadRequestException({
        field: 'current_email',
        message: 'current email is incorrect',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // 同じメールへの変更は禁止とする
    if (updateEmailDto.current_email === updateEmailDto.new_email) {
      throw new BadRequestException({
        field: 'new_email',
        message: 'new email must be different from current email',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // 新しいメールアドレスをすでに他のユーザーに使用されている場合、エラーを返す
    const existingUser = await this.findOneByEmail(updateEmailDto.new_email);

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException({
        field: 'new_email',
        message: 'this email is already in use',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // ユーザーのメールアドレスを新しいメールアドレスに更新
    requestUser.email = updateEmailDto.new_email;
    requestUser.is_email_verified = false;

    try {
      await this.usersRepository.save(requestUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // メールアドレス認証を依頼するメールを送信
    try {
      const token =
        await this.generateTokensProvider.generateEmailVerifiedToken(
          requestUser,
        );
      await this.mailService.sendEmailChange(requestUser, token);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return requestUser;
  }
}
