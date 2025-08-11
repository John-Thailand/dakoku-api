import { format, parse, startOfMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const DEFAULT_TZ = 'Asia/Tokyo';

export class DateUtil {
  static getTargetMonthText(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): string {
    const monthStart = this.getTargetMonthDate(baseDate, timeZone);
    return format(monthStart, 'yyyy-MM-01');
  }

  static getTargetMonthDate(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): Date {
    const zonedTime = toZonedTime(baseDate, timeZone);
    const monthStart = startOfMonth(zonedTime);
    return monthStart;
  }

  static convertTextToDate(text: string) {
    const parsedDate = parse(text, 'yyyy-MM', new Date());
    return parsedDate;
  }
}
