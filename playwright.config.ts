import { defineConfig } from '@playwright/test';
import './config/dotenv';
import { buildDir } from './global-setup';

export default defineConfig({
  // Run global setup once before all tests (e.g. cleanup build directory)
  globalSetup: require.resolve('./global-setup'),

  // Directory containing test files
  testDir: './tests',

  // Retry failed tests once to reduce flakiness
  retries: 1,

  // Run tests fully in parallel (not just across projects)
  fullyParallel: true,

  // Global timeout for each test
  timeout: 8000,

  // Timeout for individual expect() assertions
  expect: {
    timeout: 5000,
  },

  // Directory for storing artifacts (screenshots, videos, traces)
  outputDir: `${buildDir}/artifacts`,

  // Reporters for test results
  reporter: [
    ['html', { outputFolder: `${buildDir}/html-report`, open: 'never' }],
    ['junit', { outputFile: `${buildDir}/junit/results.xml` }],
    ['json', { outputFile: `${buildDir}/json/results.json` }],
  ],

  // Shared settings for all tests
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

  // Limit workers in CI to 2, use 4 locally
  workers: process.env.CI ? 2 : 4,
});
