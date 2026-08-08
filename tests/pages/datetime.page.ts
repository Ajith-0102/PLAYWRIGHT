import { expect, Page } from '@playwright/test';
import DatetimeModel from './datetime.model';

/**
 * DatetimePage
 * ------------
 * Page-level date validation and assertion methods using DatetimeModel utilities.
 */
export default class DatetimePage {
  constructor(private page: Page) {}

  /**
   * Validate that a date on the UI matches the expected date after format conversion.
   * @param locatorSelector CSS/XPath selector for the date element
   * @param fromFormat The format the UI date is displayed in
   * @param toFormat The format you expect it to be converted to
   * @param expectedDate The expected date string in the target format
   */
  async validateDateFormat(locatorSelector: string, fromFormat: string, toFormat: string, expectedDate: string) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const convertedDate = DatetimeModel.convertFormat(uiDateText, fromFormat, toFormat);
    expect(convertedDate).toBe(expectedDate);
  }

  /**
   * Validate that a date on the UI is within the allowed range from today.
   * @param locatorSelector CSS/XPath selector for the date element
   * @param format The format the UI date is displayed in
   * @param daysBefore Allowed days before today
   * @param daysAfter Allowed days after today
   */
  async validateDateWithinRange(locatorSelector: string, format: string, daysBefore: number, daysAfter: number) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const isWithinRange = DatetimeModel.isDateWithinRangeFromToday(uiDateText, format, daysBefore, daysAfter);
    expect(isWithinRange).toBeTruthy();
  }

  /**
   * Validate "Created" or "Last Updated" date in `MMM DD` format (e.g., "May 14").
   * Year is assumed to be the current year.
   * @param locatorSelector CSS/XPath selector for the date element
   */
  async validateMonthDayFormat(locatorSelector: string) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const currentYear = DatetimeModel.getCurrentDate('YYYY');
    const fullDate = `${uiDateText} ${currentYear}`;
    const isValid = DatetimeModel.isValidDate(fullDate, 'MMM DD YYYY');
    expect(isValid).toBeTruthy();
  }

  /**
   * Validate that a date matches today's date in the given format.
   * @param locatorSelector CSS/XPath selector for the date element
   * @param format Expected date format
   */
  async validateDateIsToday(locatorSelector: string, format: string) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const today = DatetimeModel.getCurrentDate(format);
    expect(uiDateText).toBe(today);
  }

  /**
   * Validate that a date is before today's date.
   * @param locatorSelector CSS/XPath selector for the date element
   * @param format Date format in the UI
   */
  async validateDateIsBeforeToday(locatorSelector: string, format: string) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const isBefore = DatetimeModel.isDateWithinRangeFromToday(uiDateText, format, 3650, -1);
    expect(isBefore).toBeTruthy();
  }

  /**
   * Validate that a date is after today's date.
   * @param locatorSelector CSS/XPath selector for the date element
   * @param format Date format in the UI
   */
  async validateDateIsAfterToday(locatorSelector: string, format: string) {
    const uiDateText = (await this.page.locator(locatorSelector).textContent())?.trim() || '';
    const isAfter = DatetimeModel.isDateWithinRangeFromToday(uiDateText, format, -1, 3650);
    expect(isAfter).toBeTruthy();
  }

  /**
   * Compare two dates on the UI and ensure they are equal after format conversion.
   * @param locator1 First date element selector
   * @param locator2 Second date element selector
   * @param format Date format in UI
   */
  async validateTwoDatesMatch(locator1: string, locator2: string, format: string) {
    const date1 = (await this.page.locator(locator1).textContent())?.trim() || '';
    const date2 = (await this.page.locator(locator2).textContent())?.trim() || '';
    expect(DatetimeModel.isSameDate(date1, date2, format)).toBeTruthy();
  }


}
/**
 * Validates that the displayed date string from the UI matches the 
 * expected business rule formatting (due/overdue conditions).
 *
 * Business rules:
 * - Today            => "Due today"
 * - Tomorrow         => "Due tomorrow"
 * - Within 7 days    => "Due in X days"
 * - Future date > 7d => "Due {MMM dd}"
 * - Yesterday        => "Overdue 1 day"
 * - Last 7 days      => "Overdue X days"
 * - Past date > 7d   => "Overdue {MMM dd}"
 *
 * @param expectedInput - Input string containing the expected due/overdue date
 *                        e.g. "Due Aug 19, 2025" or "Overdue Aug 10, 2025".
 * @param uiDisplayedText - The actual text displayed in the UI to validate against.
 *
 * @throws Will throw an error if the expected date cannot be parsed.
 */
export async function verifyDateDisplay(expectedInput: string, uiDisplayedText: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Extract date portion from input (remove "Due"/"Overdue" prefix)
  const datePart = expectedInput.replace(/^(Due|Overdue)\s+/i, "").trim();

  // Parse expected date
  const targetDate = new Date(datePart);
  if (isNaN(targetDate.getTime())) {
    throw new Error(`Invalid expected date format: "${expectedInput}"`);
  }
  targetDate.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const diffDays = Math.floor(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let expectedDisplay: string;

  if (diffDays === 0) {
    expectedDisplay = "Due today";
  } else if (diffDays === 1) {
    expectedDisplay = "Due tomorrow";
  } else if (diffDays > 1 && diffDays <= 7) {
    expectedDisplay = `Due in ${diffDays} days`;
  } else if (diffDays > 7) {
    const formatted = targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    expectedDisplay = `Due ${formatted}`;
  } else if (diffDays === -1) {
    expectedDisplay = "Overdue 1 day";
  } else if (diffDays < -1 && diffDays >= -7) {
    expectedDisplay = `Overdue ${Math.abs(diffDays)} days`;
  } else {
    const formatted = targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    expectedDisplay = `Overdue ${formatted}`;
  }

  // Normalize for comparison (ignore case & year)
  const normalize = (str: string) =>
    str.toLowerCase().replace(/,\s*\d{4}/, "").trim();

  expect(normalize(uiDisplayedText)).toBe(normalize(expectedDisplay));


  /**
 * Extracts and parses the date part from a string like "type,MM/DD/YYYY".
 * Returns a Date object with time set to 00:00:00.000, or null if invalid.
 *
 * @param {string} input - The input string containing a type and a date (comma separated).
 * @returns {Promise<Date | null>} - A Date object if valid, otherwise null.
 */
async function extractDateFromString(input: string): Promise<Date | null> {
  const [type, datePart] = input.split(',');
  if (datePart && /^\d{2}\/\d{2}\/\d{4}$/.test(datePart)) {
    const parsedDate = new Date(datePart);
    if (!isNaN(parsedDate.getTime())) {
      parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    }
  }
  return null;
}

/**
 * Formats a list of date strings into "MM/DD/YYYY".
 * If year is missing, appends a default year.
 *
 * @param {string[]} dateList - List of date strings.
 * @returns {Promise<string[]>} - List of formatted date strings.
 */
async function formatDates(dateList: string[]): Promise<string[]> {
  const defaultYear = 2025;

  return dateList.map((input) => {
    let date: Date;

    try {
      date = new Date(input);
      if (isNaN(date.getTime())) {
        // If year is missing, append default year
        date = new Date(`${input},${defaultYear}`);
      }
    } catch {
      throw new Error(`Invalid date format: ${input}`);
    }

    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  });
}

}

