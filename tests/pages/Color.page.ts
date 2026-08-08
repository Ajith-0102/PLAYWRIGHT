import { expect, Locator, Page } from '@playwright/test';
import ColorModel from './color.model';

export default class ColorPage {
  constructor(private page: Page) {}

  /**
   * Get the text color of a given locator.
   *
   * @param locator - Playwright Locator of the element.
   * @returns The computed `color` CSS property in RGB format.
   *
   * @example
   * const color = await colorPage.getTextColor(page.locator('h1'));
   * console.log(color); // "rgb(255, 0, 0)"
   */
  public async getTextColor(locator: Locator): Promise<string> {
    const colorValue = await locator.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    return colorValue.trim();
  }

  /**
   * Get the background color of a given locator.
   *
   * @param locator - Playwright Locator of the element.
   * @returns The computed `background-color` CSS property in RGB format.
   *
   * @example
   * const bgColor = await colorPage.getBackgroundColor(page.locator('.btn'));
   * console.log(bgColor); // "rgb(0, 128, 0)"
   */
  public async getBackgroundColor(locator: Locator): Promise<string> {
    const bgColorValue = await locator.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    return bgColorValue.trim();
  }

  /**
   * Assert that the text color of a given locator matches the expected color.
   *
   * @param locator - Playwright Locator of the element.
   * @param expectedColor - Color name, RGB, or HEX value.
   *
   * @example
   * await colorPage.expectTextColorToBe(page.locator('h1'), 'red');
   * await colorPage.expectTextColorToBe(page.locator('h1'), '#ff0000');
   */
  public async expectTextColorToBe(locator: Locator, expectedColor: string): Promise<void> {
    const actualColor = await this.getTextColor(locator);
    const isMatch = ColorModel.compareColors(actualColor, expectedColor);
    expect(isMatch, `Expected text color to be "${expectedColor}", but got "${actualColor}"`).toBe(true);
  }

  /**
   * Assert that the background color of a given locator matches the expected color.
   *
   * @param locator - Playwright Locator of the element.
   * @param expectedColor - Color name, RGB, or HEX value.
   *
   * @example
   * await colorPage.expectBackgroundColorToBe(page.locator('.btn'), 'green');
   * await colorPage.expectBackgroundColorToBe(page.locator('.btn'), '#00ff00');
   */
  public async expectBackgroundColorToBe(locator: Locator, expectedColor: string): Promise<void> {
    const actualColor = await this.getBackgroundColor(locator);
    const isMatch = ColorModel.compareColors(actualColor, expectedColor);
    expect(isMatch, `Expected background color to be "${expectedColor}", but got "${actualColor}"`).toBe(true);
  }

  /**
   * Check if text color of an element matches a given color (without assertion).
   *
   * @param locator - Playwright Locator of the element.
   * @param expectedColor - Color name, RGB, or HEX value.
   * @returns Boolean indicating if the colors match.
   *
   * @example
   * const isRed = await colorPage.isTextColor(page.locator('h1'), 'red');
   * console.log(isRed); // true or false
   */
  public async isTextColor(locator: Locator, expectedColor: string): Promise<boolean> {
    const actualColor = await this.getTextColor(locator);
    return ColorModel.compareColors(actualColor, expectedColor);
  }

  /**
   * Check if background color of an element matches a given color (without assertion).
   *
   * @param locator - Playwright Locator of the element.
   * @param expectedColor - Color name, RGB, or HEX value.
   * @returns Boolean indicating if the colors match.
   *
   * @example
   * const isGreen = await colorPage.isBackgroundColor(page.locator('.btn'), 'green');
   * console.log(isGreen); // true or false
   */
  public async isBackgroundColor(locator: Locator, expectedColor: string): Promise<boolean> {
    const actualColor = await this.getBackgroundColor(locator);
    return ColorModel.compareColors(actualColor, expectedColor);
  }
}
