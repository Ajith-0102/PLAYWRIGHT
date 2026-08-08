import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import type { Page } from '@playwright/test';

/**
 * VisualRegressionPage
 *
 * Usage:
 * const vr = new VisualRegressionPage();
 * const beforePath = await vr.takeScreenshot(page, 'homepage');
 * // Later (e.g., tomorrow) capture another screenshot and compare:
 * const afterPath = await vr.takeScreenshot(page, 'homepage-latest');
 * const result = await vr.compareScreenshots(beforePath, afterPath, 'homepage-diff');
 */
export class VisualRegressionPage {
  screenshotsDir: string;

  constructor(screenshotsDir?: string) {
    this.screenshotsDir = screenshotsDir || path.join(process.cwd(), 'reports', 'screenshots');
    fs.ensureDirSync(this.screenshotsDir);
  }

  /**
   * Take a full-page screenshot and save with a date prefix.
   * Returns the absolute path to the saved PNG.
   */
  async takeScreenshot(page: Page, name = 'screenshot'): Promise<string> {
    const date = dayjs().format('YYYY-MM-DD');
    const fileName = `${date}-${name}.png`;
    const fullPath = path.join(this.screenshotsDir, fileName);
    await page.screenshot({ path: fullPath, fullPage: true });
    return fullPath;
  }

  /**
   * Compare two PNG files and write a diff image.
   * Returns an object with diffPixels, totalPixels, and percent mismatch.
   */
  async compareScreenshots(referencePath: string, latestPath: string, diffName = 'diff'): Promise<{ diffPixels: number; totalPixels: number; percent: number; diffPath: string }> {
    if (!fs.existsSync(referencePath)) throw new Error(`Reference screenshot not found: ${referencePath}`);
    if (!fs.existsSync(latestPath)) throw new Error(`Latest screenshot not found: ${latestPath}`);

    const img1 = PNG.sync.read(fs.readFileSync(referencePath));
    const img2 = PNG.sync.read(fs.readFileSync(latestPath));

    // If image sizes differ, we'll normalize by expanding the smaller to the larger with transparent background
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);

    const img1Resized = new PNG({ width, height });
    const img2Resized = new PNG({ width, height });

    PNG.bitblt(img1, img1Resized, 0, 0, img1.width, img1.height, 0, 0);
    PNG.bitblt(img2, img2Resized, 0, 0, img2.width, img2.height, 0, 0);

    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(img1Resized.data, img2Resized.data, diff.data, width, height, { threshold: 0.1 });
    const totalPixels = width * height;
    const percent = (diffPixels / totalPixels) * 100;

    const diffFileName = `${dayjs().format('YYYY-MM-DD')}-${diffName}.png`;
    const diffPath = path.join(this.screenshotsDir, diffFileName);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    return { diffPixels, totalPixels, percent, diffPath };
  }

  /**
   * Convenience: take a new screenshot and compare to an existing reference file path.
   * Returns the compare result.
   */
  async captureAndCompare(page: Page, referencePath: string, nameForLatest = 'latest', diffName = 'diff') {
    const latestPath = await this.takeScreenshot(page, nameForLatest);
    return this.compareScreenshots(referencePath, latestPath, diffName);
  }
}

export default VisualRegressionPage;
