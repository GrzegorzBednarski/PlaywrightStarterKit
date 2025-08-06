# PlaywrightStarterKit

Playwright framework with pre-configured plugins

## Prerequisites

- Node.js
- NPM

## Installation

Run the following commands in your console:

```sh
npm install
npx playwright install
```

## Running Tests

To run tests, you must always specify the environment using the ENV variable. You can run tests in CLI or GUI mode by adding the `--ui` flag.

### Example scripts in `package.json`

```json
"scripts": {
  "pw:run:example": "cross-env ENV=example npx playwright test --project=EXAMPLE",
  "pw:open:example": "cross-env ENV=example npx playwright test --ui --project=EXAMPLE",
  "pw:run:accessibility:example": "cross-env ENV=example npx playwright test tests/accessibility --project=EXAMPLE"
  "pw:run:analytics:example": "cross-env ENV=example npx playwright test tests/analytics --project=EXAMPLE",
  "pw:run:functional:example": "cross-env ENV=example npx playwright test tests/functional --project=EXAMPLE",
}
```

To run tests, use one of the following commands:

```sh
npm run pw:run:example               # Run all tests in CLI mode
npm run pw:open:example              # Run all tests in Playwright UI mode
npm run pw:run:accessibility:example # Run only accessibility tests
npm run pw:run:analytics:example     # Run only analytics tests
npm run pw:run:functional:example    # Run only functional tests
```

### Running Tests for a Specific Environment

To run tests for a specific environment, set the ENV variable and specify the project name (see [Environment Configuration](#environment-configuration)):

```sh
cross-env ENV=staging npx playwright test --project=STAGING --ui
```

You can also add scripts to your `package.json` for convenience:

```json
"scripts": {
  "pw:run:staging": "cross-env ENV=staging npx playwright test --project=STAGING",
  "pw:open:staging": "cross-env ENV=staging npx playwright test --ui --project=STAGING"
}
```

Then run:

```sh
npm run pw:run:staging
npm run pw:open:staging
```

### Running Analytics Tests

To run only the analytics tests located in the tests/analytics folder:

```sh
npm run pw:run:analytics:example
```

### Running Accessibility Tests

To run only the accessibility tests located in the `tests/accessibility` folder:

```sh
npm run pw:run:accessibility:example
```

For more details on how to configure accessibility tests, see the [Accessibility Testing](#accessibility-testing) section.

### Running Functional Tests

To run only the functional tests located in the tests/functional folder:

```sh
npm run pw:run:functional:example
```

## 📁 Framework Structure

```
PlaywrightStarterKit/
├── 📁 build/            # Generated reports and artifacts (auto-created)
│   ├── accessibility-reports/
│   ├── html-report/
│   ├── json/
│   ├── junit/
│   └── performance-reports/
├── 📁 config/           # Global configuration files
│   ├── accessibilityConfig.ts
│   ├── analyticsConfig.ts
│   ├── dotenvConfig.ts
│   └── performanceConfig.ts
├── 📁 data/             # Test data and constants
│   ├── cookies.ts       # Cookie definitions for testing
│   ├── intercepts.ts    # URL patterns for request mocking
│   ├── paths.ts         # Page URLs and navigation
│   └── selectors.ts     # Element selectors
├── 📁 docs/             # Documentation files
│   ├── accessibility.md
│   ├── analytics.md
│   ├── cookies.md
│   ├── eslint.md
│   ├── performance.md
│   ├── replaceText.md
│   ├── testConfiguration.md
│   └── ... (other tool docs)
├── 📁 env/              # Environment variables (.env files)
├── 📁 fixtures/         # Test fixtures and mock data
│   ├── analytics/       # Analytics event fixtures
│   └── intercepts/      # HTTP response fixtures
├── 📁 tests/            # Test files organized by type
│   ├── accessibility/   # WCAG compliance tests
│   ├── analytics/       # Event tracking tests
│   ├── functional/      # Feature and UI tests
│   └── performance/     # Performance and Core Web Vitals
├── 📁 utils/            # Utility functions and helpers
│   ├── accessibility.ts
│   ├── analytics.ts
│   ├── performance.ts
│   ├── replaceText.ts
│   ├── setCookies.ts
│   └── ... (other utilities)
├── eslint.config.js     # ESLint configuration
├── global-setup.ts      # Pre-test setup (cleaning build folder)
├── global-teardown.ts   # Post-test cleanup (merging reports)
├── playwright.config.ts # Main Playwright configuration
└── tsconfig.json        # TypeScript configuration
```

### Key Directories

- **`build/`** - Auto-generated reports and test artifacts (cleaned before each run)
- **`config/`** - Global configuration for different testing features and tools
- **`data/`** - Centralized test data management (URLs, selectors, mock patterns)
- **`docs/`** - Comprehensive documentation for all framework features
- **`env/`** - Environment-specific variables and secrets (.env files)
- **`fixtures/`** - Mock data and expected results for automated testing
- **`tests/`** - Test files organized by type for better maintainability
- **`utils/`** - Reusable helper functions and framework integrations

## Environment Configuration

PlaywrightStarterKit uses two mechanisms for environment management:

1. **Project-based configuration in Playwright config**
   - Non-secret values (e.g. baseURL, timeouts, browser settings) are set in `playwright.config.ts` using the `projects` array.
   - Each project can have its own name and config values. Example:
     ```ts
     export default defineConfig({
       projects: [
         {
           name: 'EXAMPLE',
           timeout: 10000,
           use: {
             baseURL: 'https://www.vml.com',
           },
         },
         {
           name: 'STAGING',
           timeout: 12000,
           use: {
             baseURL: 'https://staging.vml.com',
           },
         },
         // Add more projects here
       ],
     });
     ```
   - This allows you to run tests for different environments by specifying the project name.
   - You can access config values (like timeout, baseURL) in your tests via the `testInfo.project` object or via Playwright's test context:
     ```ts
     test('should use config values', async ({ page }, testInfo) => {
       console.log('Project name:', testInfo.project.name);
       console.log('Project timeout:', testInfo.project.timeout);
       console.log('Project baseURL:', testInfo.project.use.baseURL);
     });
     ```
   - See [How to use config values in tests](#how-to-use-config-values-in-tests) for more details.

2. **Secrets and environment variables with dotenv**
   - Secret values (e.g. API tokens, credentials) are stored in `.env` files inside the `env/` directory (e.g. `env/.env.example`).
   - The `config/dotenvConfig.ts` file loads the correct `.env` file based on the `ENV` variable (e.g. `ENV=example` loads `env/.env.example`).
   - If the file for the selected environment does not exist, the fallback is set to `env/.env.example` (see `config/dotenvConfig.ts`). You can change the fallback by editing the `fallbackName` variable in that file.
   - All files in `env/` are ignored by git except for `env/.env.example`, which serves as an example for your environment variables.
   - Example `.env.example`:
     ```dotenv
     ENV=example
     PERCY_TOKEN=xyz
     ADMIN_USERNAME=admin@example.com
     ADMIN_PASSWORD=super-secret
     ```
   - Dotenv is loaded automatically in your config, so you can use `process.env` in your tests and config files.

### How dotenv works in this project

- The config loads the correct `.env` file based on the `ENV` variable (e.g. `ENV=dev` loads `env/.env.dev`).
- If the file does not exist, it falls back to `env/.env.example` (see `config/dotenvConfig.ts`).
- You can change the fallback environment by editing the `fallbackName` variable in `config/dotenvConfig.ts`.
- All environment variables from the file are available via `process.env` in your tests and config.
- See [How to use environment variables in tests](#how-to-use-environment-variables-in-tests) for usage examples.

### How to add a new environment

1. **Add a new project to `playwright.config.ts`**
   - Copy the example project and adjust its name and config values (e.g. add `STAGING` with its own timeout and baseURL).
2. **Add a new secrets file to `env/`**
   - Create a new file, e.g. `env/.env.staging`, and add your secret values.
   - Do not commit this file to git (it is ignored by default).
3. **Run tests for the new environment**
   - Use the ENV variable and the project name in your npm script or CLI command:
     ```sh
     cross-env ENV=staging npx playwright test --project=STAGING
     ```
   - You can add a script to `package.json` for convenience:
     ```json
     "pw:run:staging": "cross-env ENV=staging npx playwright test --project=STAGING"
     ```

### How to use environment variables in tests

- You can access any value from your `.env` file using `process.env`:
  ```ts
  console.log(process.env.ADMIN_USERNAME);
  console.log(process.env.PERCY_TOKEN);
  ```
- See the test [`should display environment variables and config`](#usage) in `tests/functional/sample-functional.spec.ts` for a usage example.

### How to use config values in tests

- You can access config values (like timeout, baseURL, or custom values) from the current project using the `testInfo.project` object or Playwright's test context:
  ```ts
  test('should use config values', async ({ page }, testInfo) => {
    console.log('Project name:', testInfo.project.name);
    console.log('Project timeout:', testInfo.project.timeout);
    console.log('Project baseURL:', testInfo.project.use.baseURL);
  });
  ```
- This is useful for debugging or for writing tests that depend on project-specific configuration.

### Best practices

- Never commit real secrets or credentials to the repository.
- Use `env/.env.example` as a template for new environments and document required variables.
- Store non-secret config in `playwright.config.ts` projects, and secrets in `env/.env.*` files.

## Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)

## Configuration

### 🔧 Core Configuration
- **[Main Config](./docs/playwrightConfig.md)** - Playwright test configuration and global setup
- **[Test Configuration](./docs/testConfiguration.md)** - Advanced test execution modes, timeouts, and retries
- **[Test Reports](./docs/testReports.md)** - HTML, JSON, JUnit, and console reporters

### 🎨 Code Quality & Formatting
- **[ESLint](./docs/eslint.md)** - Code linting and static analysis
- **[Prettier](./docs/prettier.md)** - Code formatting and style enforcement
- **[TypeScript](./docs/typescript.md)** - Type checking and compiler settings

### 🔗 Git Automation
- **[Husky](./docs/husky.md)** - Git hooks management and pre-commit automation
- **[Lint-staged](./docs/lintStaged.md)** - Pre-commit file processing and quality checks

### 🧪 Testing Features
- **[Accessibility](./docs/accessibility.md)** - WCAG compliance and automated accessibility testing
  - [Configuration](./docs/accessibility.md#configuration) | [Usage](./docs/accessibility.md#usage)
- **[Analytics](./docs/analytics.md)** - Event tracking verification and data layer testing
  - [Configuration](./docs/analytics.md#configuration) | [Usage](./docs/analytics.md#usage)
- **[Performance](./docs/performance.md)** - Core Web Vitals and Lighthouse audits
  - [Configuration](./docs/performance.md#configuration) | [Usage](./docs/performance.md#usage)

## Usage

### 🛠️ Test Utilities
- **[Cookies Management](./docs/cookies.md)** - Inject predefined cookies for bypassing banners and setting preferences
    - [Configuration](./docs/cookies.md#configuration) | [Usage](./docs/cookies.md#usage) | [Cookie Scenarios](./docs/cookies.md#cookie-scenarios)
- **[iFrames](./docs/iFrames.md)** - Working with embedded frames and nested browsing contexts
- **[Network Idle State](./docs/networkIdleState.md)** - Waiting for page stability and AJAX completion
- **[Intercepting Requests](./docs/interceptingRequests.md)** - HTTP response mocking and fixture-based testing
- **[Replace Text](./docs/replaceText.md)** - Modify text content in DOM elements for testing scenarios
