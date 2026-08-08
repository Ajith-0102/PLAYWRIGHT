module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require-module tsconfig-paths/register',
    '--require support/**/*.ts',
    '--require tests/steps/**/*.ts',
    '--format @cucumber/pretty-formatter',
    '--format json:reports/cucumber-report.json',
    '--publish-quiet',
    'tests/features/**/*.feature',
  ].join(' ')
};
