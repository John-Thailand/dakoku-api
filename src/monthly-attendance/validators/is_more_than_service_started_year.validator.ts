import { registerDecorator, ValidationArguments } from 'class-validator';
import { HYPHEN, SERVICE_STARTED_YEAR } from '../constants/constants';

export function IsMoreThanServiceStartedYear() {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsMoreThanServiceStartedYear', // 識別名
      target: object.constructor, // object.constructor = class CloseMyMonthlyAttendance
      propertyName, // target_month
      constraints: [], // 外部から渡された制約値
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // 勤怠サービスが開始された年以上であるか確認
          const splitedValue = value.split(HYPHEN);
          const year = Number(splitedValue[0]);
          return year >= SERVICE_STARTED_YEAR;
        },
        defaultMessage(_args: ValidationArguments) {
          return `target_month must be year >= ${SERVICE_STARTED_YEAR}`;
        },
      },
    });
}
