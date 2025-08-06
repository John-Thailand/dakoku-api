import { stringify } from 'csv-stringify/sync';
import { UserDto } from 'src/users/dtos/user.dto';

export class UserUtil {
  static createCsvFromUsers(users: UserDto[]): string {
    const header = ['ID', 'メールアドレス', '名前', '登録日時', '更新日時'];

    const rows = users.map((user) => [
      user.id,
      user.email,
      user.name,
      user.created_at.toISOString(),
      user.updated_at.toISOString(),
    ]);

    return stringify([header, ...rows], {
      delimiter: ',',
      // [1, a@gmail.com, naoki] -> ["1", "a@gmail.com", "naoki"]
      quoted: true,
    });
  }
}
