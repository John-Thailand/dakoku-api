import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { SearchUsersRequestDto } from './dtos/search-users-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(UserDto)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(UserDto)
  public patchUser(
    @Param('id') id: string,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.usersService.patchUser(id, patchUserDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(UserDto)
  @HttpCode(204)
  public deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // 検索はデータを見るだけで副作用がないのでGETにする
  @Get()
  // @UseGuards(AuthGuard, AdminGuard)
  // @Serialize(SearchUsersResponseDto)
  // /users?email=aaa@gmail.com&order_by=created_at のように RESTでは状態の取得に必要な条件をURLで表現すべきという考え
  // 同じURLを再度アクセスすることで同じ検索結果を得られる
  public searchUsers(@Query() query: SearchUsersRequestDto) {
    console.log(query);
  }
}
