# Playwright Configuration

← [Back to main documentation](../README.md)

General configuration is set in the `playwright.config.ts` file. This file contains global settings such as timeouts, parallelism, baseURL, and other options that apply to all tests by default.

## Key configuration options and their purposes

- **Global Setup**: Use `globalSetup` to run setup tasks before all tests (e.g., cleaning directories, preparing test data)
- **Global Teardown**: Use `globalTeardown` to run cleanup tasks after all tests (e.g., merging reports, cleanup operations)
- **Parallel Execution**: Enable `fullyParallel: true` to run tests simultaneously for faster execution
- **Retries**: Set `retries` to automatically retry failed tests and reduce flakiness
- **Artifacts**: Configure `screenshot`, `video`, and `trace` options to capture debugging information when needed
- **Workers**: Control `workers` count to optimize performance based on environment (fewer in CI, more locally)
- **Timeouts**: Set global `timeout` for tests and `expect.timeout` for assertions
- **Output Directory**: Use `outputDir` to specify where test artifacts are stored
- **Reporters**: Configure multiple report formats (HTML, JSON, JUnit) for different use cases

## Example configuration structure

```ts
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
    ['list'],
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
  // Limit workers in CI to 2, use 4 locally
  workers: process.env.CI ? 2 : 4,
});
```

## Global Setup and Teardown

- **Global Setup** (`global-setup.ts`): Runs once before all tests begin. Used for cleaning build directories and preparing the test environment.
- **Global Teardown** (`global-teardown.ts`): Runs once after all tests complete. Used for post-test operations like merging accessibility reports into a single file.

## Environment-specific configuration

The configuration uses environment variables and [dotenv configuration](../README.md#environment-configuration) to load different settings for different environments (development, staging, production).

## Overriding configuration values

You can overwrite specific configuration parameters by passing them via the command line interface (CLI) or by using environment-specific config files. This allows you to change settings for a single test run without modifying the main configuration file.

For example, you can set the environment using the `ENV` variable to load a specific config file for development, staging, or production (see the [Environment Configuration](../README.md#environment-configuration) section for more details). This is useful for managing settings that vary between different environments.

You can also override some Playwright options directly in the CLI, e.g.:

```sh
npx playwright test --grep "@smoke" --workers=2
```

This flexibility allows you to tailor test runs to your needs without changing the main config file.

For more information about Playwright configuration, see:

- [Playwright Test Configuration Documentation](https://playwright.dev/docs/test-configuration)
