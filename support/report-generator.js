const reporter = require('cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  screenshotsDirectory: 'reports/screenshots/',
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  launchReport: true,
};

fs.ensureDirSync(path.dirname(options.jsonFile));
reporter.generate(options);
