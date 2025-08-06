import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
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
import { SearchUsersResponseDto } from './dtos/search-users-response.dto';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UserUtil } from 'src/utils/user.util';
import { Response } from 'express';

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
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(SearchUsersResponseDto)
  // /users?email=aaa@gmail.com&order_by=created_at のように RESTでは状態の取得に必要な条件をURLで表現すべきという考え
  // 同じURLを再度アクセスすることで同じ検索結果を得られる
  public searchUsers(
    @Query() query: SearchUsersRequestDto,
  ): Promise<SearchUsersResponseDto> {
    return this.usersService.searchUsers(query);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  public getMe(@Req() request) {
    // TODO: デコレータを作成しても良いかも
    const requestUser = request[REQUEST_USER_KEY];
    return this.usersService.findOneById(requestUser.sub);
  }

  @Put('/me/password')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  public updatePassword(
    @Req() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    // TODO: デコレータを作成しても良いかも
    const requestUser = request[REQUEST_USER_KEY];
    return this.usersService.updatePassword(requestUser.sub, updatePasswordDto);
  }

  @Put('/me/email')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  public updateEmail(@Req() request, @Body() updateEmailDto: UpdateEmailDto) {
    // TODO: デコレータを作成しても良いかも
    const requestUser = request[REQUEST_USER_KEY];
    return this.usersService.updateEmail(requestUser.sub, updateEmailDto);
  }

  // csvはフォマットであって何をするかではない。エクスポートする機能なら'export'とした方が良い
  // ?format=csvや?format=pdfなどフォーマットの拡張性がある
  @Get('export')
  @UseGuards(AuthGuard, AdminGuard)
  public async exportUsersAsCsv(
    @Query() query: SearchUsersRequestDto,
    @Res() response: Response,
  ) {
    // ユーザー検索を行い、その情報をCSV形式のString型の値に変換
    const result = await this.usersService.searchUsers(query);
    const csvData = UserUtil.createCsvFromUsers(result.users);

    // レスポンスヘッダーを設定
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader(
      'Content-Disposition', // レスポンスの中身をブラウザがどう処理すべきか指示する
      'attachment; filename="users.csv"', // attachmentはクライアント（ブラウザ）にファイルとしてダウンロードさせる
    );

    // CSVデータを送信
    // UTF-8 BOM（Byte Order Mark）を先頭に追加することで、Excelでの文字化けを防止
    response.send('\uFEFF' + csvData);
  }
}
