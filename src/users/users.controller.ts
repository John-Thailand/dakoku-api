import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: 管理者のみユーザーを作成できる
  @Post()
  @UseGuards(AuthGuard)
  // @Excludeを有効にして、is_administratorとpasswordをレスポンスから除外する
  @UseInterceptors(ClassSerializerInterceptor)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  public patchUser(
    @Param('id') id: string,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.usersService.patchUser(id, patchUserDto);
  }

  // TODO: 管理者のみユーザーを削除できる
  @Delete('/:id')
  @HttpCode(204)
  public deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
