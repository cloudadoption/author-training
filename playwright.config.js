/* eslint-env node */
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    browserName: 'chromium',
    headless: true,
  },
  webServer: {
    command: 'node tools/prepare-preview.mjs && npx -y @adobe/aem-cli up --html-folder .preview --html-mount / --port 3100 --no-open --no-livereload --no-stop-other',
    url: 'http://127.0.0.1:3100',
    timeout: 60000,
  },
});
