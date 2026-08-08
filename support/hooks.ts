import {
  BeforeAll,
  Before,
  AfterAll,
  After,
  AfterStep,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium } from '@playwright/test';
import fs from 'fs-extra';
import path from 'path';
import { CustomWorld } from './custom-world';

setDefaultTimeout(60 * 1000);

let browser: Browser;

// 🚀 Launch browser before all tests
BeforeAll(async () => {
  browser = await chromium.launch({
    headless: true,
    args: ['--start-maximized'],
  });
});

// 🧪 Setup context and page before each scenario
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    recordVideo: { dir: 'reports/videos/' },
    viewport: null, // optional: full screen
  });

  // Capture browser console logs
  this.consoleLogs = [];
  this.context.on('page', page => {
    page.on('console', msg => {
      this.consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });
  });

  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.stepCounter = 0;
});

// 📸 Capture screenshot only on failure
AfterStep(async function (this: CustomWorld, { result }) {
  this.stepCounter++;

  if (result?.status === Status.FAILED) {
    // Attach screenshot
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshotBuffer, 'image/png');

    // Attach console logs
    const logs = this.consoleLogs.join('\n') || 'No console logs.';
    await this.attach(logs, 'text/plain');
  }
});

// 🧹 Cleanup and attach trace/video after each scenario
After(async function (this: CustomWorld, { pickle }) {
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9-_]/g, '_');
  const reportsDir = path.join('reports');

  // Trace
  const tracePath = path.join(reportsDir, 'traces', `${scenarioName}-trace.zip`);
  await fs.ensureDir(path.dirname(tracePath));
  await this.context.tracing.stop({ path: tracePath });
  const traceBuffer = await fs.readFile(tracePath);
  await this.attach(traceBuffer, 'application/zip');

  // Video
  const video = await this.page.video();
  if (video) {
    const videoPath = await video.path();
    const videoBuffer = await fs.readFile(videoPath);
    await this.attach(videoBuffer, 'video/webm');
  }

  // Cleanup browser context
  await this.page.close();
  await this.context.close();
});

// 🔚 Close browser after all tests
AfterAll(async () => {
  await browser.close();
});
