import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = 'America/Asuncion';

/**
 * Formats date in ISO taking into account time zone
 * @param date - Date for formatting
 * @returns Formatted string ISO
 */
export function formatToISO(date: Date): string {
  return dayjs(date).tz(timeZone).toISOString();
}

/**
 * Transforms date in string "YYYY-MM-DD"
 * @param date - Date for formatting
 * @returns Formatted string
 */
export function formatToLocal(date: Date): string {
  return dayjs(date).tz(timeZone).format('YYYY-MM-DD');
}
