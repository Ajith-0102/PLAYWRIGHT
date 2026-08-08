// Import Playwright and Node modules
import { Page, BrowserContext } from '@playwright/test';
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import fs from 'fs-extra';
import path from 'path';

/**
 * CustomWorld extends the default Cucumber World class and holds
 * Playwright's `page`, `context`, and additional metadata like logs and step tracking.
 */
export class CustomWorld extends World {
  // Playwright page instance used in this scenario
  page!: Page;

  // Playwright browser context for scenario isolation
  context!: BrowserContext;

  // Console logs captured during the scenario
  consoleLogs: string[] = [];

  // Step counter for tracking executed steps
  stepCounter: number = 0;
  
  // Last visual baseline path saved by visual steps (optional)
  lastBaselinePath?: string;

  // Last visual comparison result saved by visual steps (optional)
  lastVisualResult?: { diffPixels: number; totalPixels: number; percent: number; diffPath: string };

  /**
   * Called by Cucumber before each scenario. Inherits `attach()` method from World.
   */
  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Attach a plain text message to the Cucumber report.
   * Useful for logging custom info.
   */
  async attachLog(message: string) {
    await this.attach(message, 'text/plain');
  }

  /**
   * Log the current page URL into the Cucumber report.
   */
  async logCurrentUrl() {
    const url = this.page?.url();
    if (url) {
      await this.attach(`Current page URL: ${url}`, 'text/plain');
    }
  }

  /**
   * Capture a full-page screenshot, attach to memory (for Allure) 
   * and save it to disk for HTML report.
   *
   * @param name - Optional name for the screenshot file.
   */
  async captureAndAttachScreenshot(name: string = 'screenshot') {
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });

    // Attach to in-memory report (like Allure or internal)
    await this.attach(screenshotBuffer, 'image/png');

    // Save to disk for cucumber-html-reporter
    const fileName = `${name}.png`;
    const screenshotPath = path.join('reports', 'screenshots', fileName);

    await fs.ensureDir(path.dirname(screenshotPath));
    await fs.writeFile(screenshotPath, screenshotBuffer);

    // Attach reference to disk screenshot (for HTML report)
    const relativePath = path.relative(process.cwd(), screenshotPath);
    const htmlReportAttachment = {
      screenshot: relativePath.replace(/\\/g, '/'), // for Windows compatibility
    };
    await this.attach(JSON.stringify(htmlReportAttachment), 'application/json');
  }

  /**
   * Attach all console logs collected from the browser during scenario.
   * Should be called in `After` hook.
   */
  async attachConsoleLogs() {
    if (this.consoleLogs.length > 0) {
      const logOutput = this.consoleLogs.join('\n');
      await this.attach(logOutput, 'text/plain');
    }
  }
}

// Register CustomWorld so each scenario gets its own instance
setWorldConstructor(CustomWorld);
