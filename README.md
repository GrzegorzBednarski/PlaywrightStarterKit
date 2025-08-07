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

The PlaywrightStarterKit uses a custom test runner that simplifies test execution across different environments and test types. The test runner is configured in `config/testRunnerConfig.js` and executed via the `scripts/run.js` file.

### Prerequisites for running tests

Before running tests, ensure you have properly configured:

- [**Project-based configuration**](./docs/environmentConfig.md#project-based-configuration)

- [**Secrets and environment files**](./docs/environmentConfig.md#environment-variables-and-secrets)

- [**Test Runner Configuration**](./docs/testRunner.md)

### Basic Usage

To run tests, use the following command structure:

```sh
npm run pw:test [environment] [test-type]
```

Or to run tests matching a specific tag pattern:

```sh
npm run pw:test [environment] grep:[pattern]
```

### Available Commands

```sh
npm run pw:test help               # Shows help with all available options
npm run pw:test report             # Opens the HTML test report
npm run pw:test [env] open         # Launches UI mode for selected environment
npm run pw:test [env] [testType]   # Runs tests of given type or group on selected environment
npm run pw:test [env] grep:[tag]   # Runs tests matching a specific tag pattern
```

### Examples

```sh
npm run pw:test dev functional     # Run functional tests in dev environment
npm run pw:test qa accessibility   # Run accessibility tests in qa environment
npm run pw:test stg all            # Run all test types in staging environment
npm run pw:test dev grep:[smoke]   # Run tests tagged with [smoke] in dev environment
npm run pw:test qa open            # Open Playwright UI mode for qa environment
```

### Available Environments

The environments are defined in `config/testRunnerConfig.js`. Below are example environments (your actual configuration may differ):

- `dev` - Development environment
- `qa` - QA environment
- `stg` - Staging environment
- `prod` - Production environment

For detailed information about environment configuration, see [Environment Configuration](./docs/environmentConfig.md).

### Available Test Types

Test types are defined in `config/testRunnerConfig.js`. Examples include:

- `accessibility` - Web accessibility tests
- `analytics` - Analytics tracking tests
- `functional` - Functional UI tests
- `performance` - Performance tests
- `visual` - Visual comparison tests

Additionally, you can define custom test groups in the same file to run multiple test types with a single command:
- `all` - Example group that combines multiple test types (e.g., accessibility, analytics, and functional)
- `critical` - Example group that could include tests essential for deployments (e.g., functional and performance)

For more information about test runner configuration, see [Test Runner Documentation](./docs/testRunner.md).

### Test Tags (Grep Patterns)

You can define grep patterns in `config/testRunnerConfig.js` to run specific tagged tests. Examples:

- `grep:[smoke]` - Run tests tagged with [smoke]
- `grep:[sanity]` - Run tests tagged with [sanity]
- `grep:[critical]` - Run tests tagged with [critical]

To tag a test, include the tag in the test title:

```typescript
test('[smoke] User can log in', async ({ page }) => {
  // Test implementation
});
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

## Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)

## Configuration

### 🔧 Core Configuration
- **[Environment Configuration](./docs/environmentConfig.md)** - Environment setup and configuration
- **[Main Config](./docs/playwrightConfig.md)** - Playwright test configuration and global setup
- **[Test Configuration](./docs/testConfiguration.md)** - Advanced test execution modes, timeouts, and retries
- **[Test Reports](./docs/testReports.md)** - HTML, JSON, JUnit, and console reporters
- **[Test Runner](./docs/testRunner.md)** - Custom test runner settings

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
- **[Visual](./docs/visual.md)** - Visual regression testing with Percy
  - [Configuration](./docs/visual.md#configuration) | [Usage](./docs/visual.md#usage)

## Usage

### 🛠️ Test Utilities
- **[Cookies Management](./docs/cookies.md)** - Inject predefined cookies for bypassing banners and setting preferences
    - [Configuration](./docs/cookies.md#configuration) | [Usage](./docs/cookies.md#usage) | [Cookie Scenarios](./docs/cookies.md#cookie-scenarios)
- **[iFrames](./docs/iFrames.md)** - Working with embedded frames and nested browsing contexts
- **[Network Idle State](./docs/networkIdleState.md)** - Waiting for page stability and AJAX completion
- **[Intercepting Requests](./docs/interceptingRequests.md)** - HTTP response mocking and fixture-based testing
- **[Replace Text](./docs/replaceText.md)** - Modify text content in DOM elements for testing scenarios
