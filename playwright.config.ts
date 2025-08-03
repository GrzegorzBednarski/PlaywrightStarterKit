import { defineConfig } from '@playwright/test';
import './config/dotenv';
import * as fs from 'fs-extra';

const buildDir = 'build';

// Remove build directory before running tests
if (fs.existsSync(buildDir)) {
  console.log(`Removing ${buildDir} directory...`);
  fs.removeSync(buildDir);
}

export default defineConfig({
  timeout: 8000,
  outputDir: `${buildDir}/artifacts`,
  reporter: [
    ['html', { outputFolder: `${buildDir}/html-report`, open: 'never' }],
    ['junit', { outputFile: `${buildDir}/junit/results.xml` }],
    ['json', { outputFile: `${buildDir}/json/results.json` }],
  ],
  use: {
    baseURL: 'https://example.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'EXAMPLE',
      timeout: 10000,
      use: {
        baseURL: 'https://www.vml.com',
      },
    },
  ],
});
