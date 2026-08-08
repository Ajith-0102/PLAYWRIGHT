import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import path from 'path';
import { CustomWorld } from '@support/custom-world';
import VisualRegressionPage from '../../../pages/visualRegression.page';

Given('I capture a baseline screenshot for {string}', async function (this: CustomWorld, name: string) {
  const vr = new VisualRegressionPage();
  const savedPath = await vr.takeScreenshot(this.page, `${name}-baseline`);
  await this.attach(`Baseline screenshot saved: ${savedPath}`);
  // store for later assertions if desired
  this.lastBaselinePath = savedPath;
});

When('I capture a latest screenshot for {string} and compare with baseline file {string}', async function (this: CustomWorld, name: string, baselineFile: string) {
  const vr = new VisualRegressionPage();
  const baselinePath = path.isAbsolute(baselineFile) ? baselineFile : path.join(process.cwd(), 'reports', 'screenshots', baselineFile);
  const compareResult = await vr.captureAndCompare(this.page, baselinePath, `${name}-latest`, `${name}-diff`);
  this.lastVisualResult = compareResult;
  await this.attach(`Visual compare result: ${JSON.stringify(compareResult)}`);
});

Then('the visual difference should be less than {float} percent', async function (this: CustomWorld, threshold: number) {
  const result = this.lastVisualResult;
  if (!result) throw new Error('No visual comparison result found. Run compare step first.');
  expect(result.percent).toBeLessThan(threshold);
  await this.attach(`Visual diff ${result.percent.toFixed(4)}% is below threshold ${threshold}%`);
});
