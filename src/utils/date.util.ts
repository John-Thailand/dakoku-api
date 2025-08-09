import { format, startOfMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const DEFAULT_TZ = 'Asia/Tokyo';

export class DateUtil {
  static getTargetMonth(
    baseDate: Date = new Date(),
    timeZone: string = DEFAULT_TZ,
  ): string {
    const zonedTime = toZonedTime(baseDate, timeZone);
    const monthStart = startOfMonth(zonedTime);
    return format(monthStart, 'yyyy-MM-01');
  }
}
