import { defineConfig } from '@playwright/test';
import './config/dotenvConfig';
import { buildDir } from './global-setup';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  testDir: './tests',
  retries: 0,
  fullyParallel: true,
  timeout: 8000,
  expect: {
    timeout: 5000,
  },
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

  // Project-specific overrides
  projects: [
    {
      name: 'EXAMPLE',
      timeout: 10000,
      use: {
        baseURL: 'https://www.vml.com',
      },
    },
  ],

  // Limit workers in CI to X, use Y locally
  workers: process.env.CI ? 2 : 4,
});
