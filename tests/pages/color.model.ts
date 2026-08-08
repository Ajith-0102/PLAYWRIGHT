// models/color.model.ts

import { Locator } from '@playwright/test';

/**
 * A utility model for color handling and validation in Playwright automation.
 * Supports color name mapping, RGB and HEX conversion, and Playwright locator checks.
 */
export default class ColorModel {
  /**
   * Mapping of common color names to their RGB values.
   */
  private static colorMap: Record<string, string> = {
    orange: 'rgb(255, 165, 0)',
    red: 'rgb(255, 0, 0)',
    green: 'rgb(0, 128, 0)',
    blue: 'rgb(0, 0, 255)',
    yellow: 'rgb(255, 255, 0)',
    grey: 'rgb(128, 128, 128)',
    gray: 'rgb(128, 128, 128)',
    lightgrey: 'rgb(211, 211, 211)',
    lightgray: 'rgb(211, 211, 211)',
    darkgrey: 'rgb(169, 169, 169)',
    darkgray: 'rgb(169, 169, 169)',
    black: 'rgb(0, 0, 0)',
    white: 'rgb(255, 255, 255)',
    purple: 'rgb(128, 0, 128)',
    pink: 'rgb(255, 192, 203)',
    brown: 'rgb(165, 42, 42)',
    cyan: 'rgb(0, 255, 255)',
    magenta: 'rgb(255, 0, 255)',
    teal: 'rgb(0, 128, 128)',
    lime: 'rgb(0, 255, 0)',
    gold: 'rgb(255, 215, 0)',
    crimson: 'rgb(220, 20, 60)',
    'crimson-dark': 'rgb(179, 19, 52)',
  };

  /**
   * Get the RGB value for a given color name.
   * If the input is already an RGB or HEX string, it will be returned as normalized RGB.
   *
   * @param colorName - Color name, RGB string, or HEX value.
   * @returns Normalized RGB string.
   *
   * @example
   * ColorModel.getRGB('red'); // "rgb(255, 0, 0)"
   * ColorModel.getRGB('#FF0000'); // "rgb(255, 0, 0)"
   * ColorModel.getRGB('rgb(255, 0, 0)'); // "rgb(255, 0, 0)"
   */
  public static getRGB(colorName: string): string {
    return this.normalizeColor(colorName);
  }

  /**
   * Compare two colors in a normalized RGB format.
   *
   * @param actual - The actual color value (name, RGB, or HEX).
   * @param expected - The expected color value (name, RGB, or HEX).
   * @returns True if colors match, false otherwise.
   *
   * @example
   * ColorModel.compareColors('red', '#FF0000'); // true
   * ColorModel.compareColors('rgb(0,0,255)', 'blue'); // true
   */
  public static compareColors(actual: string, expected: string): boolean {
    return this.normalizeColor(actual) === this.normalizeColor(expected);
  }

  /**
   * Get the computed text color of a Playwright locator and compare it with the expected value.
   *
   * @param locator - Playwright Locator object.
   * @param expected - Expected color (name, RGB, or HEX).
   * @returns True if the text color matches, false otherwise.
   *
   * @example
   * await ColorModel.isTextColor(locator, 'red');
   */
  public static async isTextColor(locator: Locator, expected: string): Promise<boolean> {
    const actualColor = await locator.evaluate(el => getComputedStyle(el).color);
    return this.compareColors(actualColor, expected);
  }

  /**
   * Get the computed background color of a Playwright locator and compare it with the expected value.
   *
   * @param locator - Playwright Locator object.
   * @param expected - Expected background color (name, RGB, or HEX).
   * @returns True if the background color matches, false otherwise.
   *
   * @example
   * await ColorModel.isBackgroundColor(locator, '#00FF00');
   */
  public static async isBackgroundColor(locator: Locator, expected: string): Promise<boolean> {
    const actualColor = await locator.evaluate(el => getComputedStyle(el).backgroundColor);
    return this.compareColors(actualColor, expected);
  }

  /**
   * Normalize any color into an RGB string.
   *
   * @param color - Color name, RGB, or HEX.
   * @returns Normalized RGB string.
   */
  private static normalizeColor(color: string): string {
    const rgbRegex = /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/i;
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    const trimmed = color.trim().toLowerCase();

    if (rgbRegex.test(trimmed)) {
      return trimmed;
    }

    if (hexRegex.test(trimmed)) {
      return this.hexToRgb(trimmed);
    }

    return this.colorMap[trimmed] || trimmed;
  }

  /**
   * Convert HEX to RGB format.
   *
   * @param hex - HEX color string (e.g., "#FF0000" or "#F00").
   * @returns RGB string (e.g., "rgb(255, 0, 0)").
   */
  private static hexToRgb(hex: string): string {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }
}

