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

  static getTargetDateText(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): string {
    const zonedTime = toZonedTime(baseDate, timeZone);
    return format(zonedTime, 'yyyy-MM-dd');
  }

  static getTargetMonthDate(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): Date {
    const zonedTime = toZonedTime(baseDate, timeZone);
    const monthStart = startOfMonth(zonedTime);
    return monthStart;
  }

  static getTargetDate(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): Date {
    return toZonedTime(baseDate, timeZone);
  }

  static getTodayStartUtc(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): Date {
    const zoned = toZonedTime(baseDate, timeZone);
    const jstMidnightText = format(zoned, 'yyyy-MM-dd 00:00:00');
    const jstMidnightUtc = new Date(`${jstMidnightText}+09:00`);
    return jstMidnightUtc;
  }

  static convertTextToDate(text: string) {
    const parsedDate = parse(text, 'yyyy-MM', new Date());
    return parsedDate;
  }
}
