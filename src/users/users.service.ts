import {
  BadRequestException,
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    // メールアドレスでユーザーを検索する
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
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

    return newUser;
  }

  public async patchUser(userId: string, patchUserDto: PatchUserDto) {
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

    // ユーザーを更新する
    existingUser.name = patchUserDto.name ?? existingUser.name;
    existingUser.email = patchUserDto.email ?? existingUser.email;
    existingUser.password =
      patchUserDto.password === null
        ? existingUser.password
        : await this.hashingProvider.hashPassword(patchUserDto.password);

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

  public async deleteUser(userId: string) {
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
}
