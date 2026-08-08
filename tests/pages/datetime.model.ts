import dayjs, { ManipulateType } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Common date formats used in web applications.
 */
export const DateFormats = {
  FULL_DATE: 'MM/DD/YYYY',           // 05/14/2025
  FULL_DATE_DASH: 'YYYY-MM-DD',      // 2025-05-14
  DATE_TIME_12H: 'MM/DD/YYYY hh:mm A', // 05/14/2025 08:15 PM
  DATE_TIME_24H: 'MM/DD/YYYY HH:mm', // 05/14/2025 20:15
  MONTH_NAME_DAY: 'MMM DD',          // May 14
  MONTH_NAME_DAY_YEAR: 'MMM DD, YYYY', // May 14, 2025
  ISO: 'YYYY-MM-DDTHH:mm:ssZ'        // 2025-05-14T20:15:00+05:30
};

/**
 * DatetimeModel
 * -------------
 * Reusable date/time methods for formatting, conversion, and comparison.
 * All methods are static so they can be called without creating an instance.
 */
export default class DatetimeModel {

  /**
   * Converts a date string from one format to another.
   * @param dateString - The date string to convert.
   * @param fromFormat - The current format of the date string.
   * @param toFormat - The desired output format.
   * @returns The converted date string in the new format.
   * @example
   * DatetimeModel.convertFormat('14-05-2025', 'DD-MM-YYYY', DateFormats.FULL_DATE);
   * // Returns "05/14/2025"
   */
  static convertFormat(dateString: string, fromFormat: string, toFormat: string): string {
    return dayjs(dateString, fromFormat).format(toFormat);
  }

  /**
   * Gets the current date in the specified format.
   * @param format - The desired output format.
   * @returns Current date string in the given format.
   * @example
   * DatetimeModel.getCurrentDate(DateFormats.FULL_DATE);
   * // Returns "05/14/2025"
   */
  static getCurrentDate(format: string): string {
    return dayjs().format(format);
  }

  /**
   * Gets the current date and time in the specified format.
   * @param format - The desired output format.
   * @returns Current date and time in the given format.
   * @example
   * DatetimeModel.getCurrentDateTime(DateFormats.DATE_TIME_12H);
   * // Returns "05/14/2025 08:30 PM"
   */
  static getCurrentDateTime(format: string): string {
    return dayjs().format(format);
  }

  /**
   * Adds a given number of days to the current date.
   * @param days - Number of days to add (use negative to subtract days).
   * @param format - The desired output format.
   * @returns New date string after adding days.
   * @example
   * DatetimeModel.addDaysToCurrentDate(5, DateFormats.FULL_DATE);
   * // Returns "05/19/2025"
   */
  static addDaysToCurrentDate(days: number, format: string): string {
    return dayjs().add(days, 'day').format(format);
  }

  /**
   * Checks if a date falls within a range from today.
   * @param dateString - Date string to check.
   * @param format - Format of the input date string.
   * @param daysBefore - How many days before today are allowed.
   * @param daysAfter - How many days after today are allowed.
   * @returns True if the date is within the range, false otherwise.
   * @example
   * DatetimeModel.isDateWithinRangeFromToday('05/16/2025', DateFormats.FULL_DATE, 2, 3);
   * // Returns true if today is between May 14 and May 19, 2025
   */
  static isDateWithinRangeFromToday(
    dateString: string,
    format: string,
    daysBefore: number,
    daysAfter: number
  ): boolean {
    const targetDate = dayjs(dateString, format);
    const startDate = dayjs().subtract(daysBefore, 'day');
    const endDate = dayjs().add(daysAfter, 'day');
    return targetDate.isSameOrAfter(startDate, 'day') && targetDate.isSameOrBefore(endDate, 'day');
  }

  /**
   * Checks if two dates are exactly the same.
   * @param date1 - First date string.
   * @param date2 - Second date string.
   * @param format - Format of both date strings.
   * @returns True if both dates are the same, false otherwise.
   * @example
   * DatetimeModel.isSameDate('05/14/2025', '05/14/2025', DateFormats.FULL_DATE);
   * // Returns true
   */
  static isSameDate(date1: string, date2: string, format: string): boolean {
    return dayjs(date1, format).isSame(dayjs(date2, format));
  }

  /**
   * Validates if the provided date string is valid according to the given format.
   * @param dateString - Date string to validate.
   * @param format - Expected format.
   * @returns True if valid, false otherwise.
   * @example
   * DatetimeModel.isValidDate('05/14/2025', DateFormats.FULL_DATE);
   * // Returns true
   */
  static isValidDate(dateString: string, format: string): boolean {
    return dayjs(dateString, format, true).isValid();
  }

  /**
   * Adjusts a date by adding/subtracting any time unit (days, months, years, etc.).
   * @param dateString - Original date string.
   * @param format - Format of the input and output date.
   * @param amount - Amount to add (negative to subtract).
   * @param unit - Time unit to adjust (day, month, year, etc.).
   * @returns Adjusted date string.
   * @example
   * DatetimeModel.adjustDate('05/14/2025', DateFormats.FULL_DATE, 2, 'month');
   * // Returns "07/14/2025"
   */
  static adjustDate(dateString: string, format: string, amount: number, unit: ManipulateType): string {
    return dayjs(dateString, format).add(amount, unit).format(format);
  }
}
