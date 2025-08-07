# Test Runner

← [Back to main documentation](../README.md)

## Overview

PlaywrightStarterKit uses a custom test runner (`utils/testRunner.js`) that simplifies test execution across different environments and test types. The test runner is configured in `config/testRunnerConfig.js` and executed via the `scripts/run.js` file.

## Configuration

The test runner is configured in `config/testRunnerConfig.js`. This file defines:

### Environments

Environments map the command line parameter (e.g., `dev`) to:
- The environment file to load (e.g., `.env.dev`)
- The Playwright project to use (e.g., `DEV`)

Example configuration:
```javascript
environments: {
  dev: { env: 'dev', project: 'DEV' },
  qa: { env: 'qa', project: 'QA' },
  stg: { env: 'stg', project: 'STG' },
},
```

### Test Types

Test types define the directories to include for each type of test:

Example configuration:
```javascript
testTypes: {
  accessibility: ['tests/accessibility'],
  analytics: ['tests/analytics'],
  functional: ['tests/functional'],
  performance: ['tests/performance'],
  visual: ['tests/visual']
},
```

### Test Groups

Test groups allow you to run multiple test types with a single command:

Example configuration:
```javascript
testGroups: {
  all: ['accessibility', 'analytics', 'functional'],
  critical: ['functional', 'performance']
},
```

### Grep Groups

Grep groups define predefined tag patterns for running specific subsets of tests:

Example configuration:
```javascript
grepGroups: {
  sanity: '[sanity]',
  smoke: '[smoke]',
  critical: '[critical]'
},
```

### Grep Exclude

This setting excludes certain test types from grep-based test runs:

Example configuration:
```javascript
grepExclude: ['performance', 'visual'],
```

### Report Path

Defines where the HTML report will be generated:

```javascript
reportPath: 'build/html-report'
```

## Usage

### Basic Commands

The test runner is used via npm scripts defined in `package.json`:

```bash
npm run pw:test [environment] [test-type]
npm run pw:test [environment] grep:[pattern]
```

### Examples

```bash
# Run functional tests on the dev environment
npm run pw:test dev functional

# Run all tests on the staging environment
npm run pw:test stg all

# Run tests with [smoke] tag on the QA environment
npm run pw:test qa grep:smoke

# Open Playwright UI mode for the dev environment
npm run pw:test dev open

# Show help information
npm run pw:test help

# Open the HTML test report
npm run pw:test report
```

### Adding Custom Test Types

To add a new test type:

1. Create a new test directory (e.g., `tests/api/`)
2. Add test files with the `.spec.ts` extension
3. Update `testTypes` in `config/testRunnerConfig.js`:

```javascript
testTypes: {
  // ...existing types...
  api: ['tests/api']
},
```

### Adding Custom Test Groups

To create a new group that combines multiple test types:

```javascript
testGroups: {
  // ...existing groups...
  quickCheck: ['functional', 'api']
},
```

## Implementation Details

The test runner consists of two main components:

1. **`config/testRunnerConfig.js`** - Configuration file that defines environments, test types, and other settings
2. **`utils/testRunner.js`** - Core functionality that parses command-line arguments and executes Playwright tests
3. **`scripts/run.js`** - Entry point script that handles environment setup and launches the test runner

The workflow is:

1. User runs `npm run pw:test [args]`
2. `scripts/run.js` is executed with the provided arguments
3. The script loads the appropriate environment file
4. `utils/testRunner.js` builds the test execution command based on the configuration
5. Playwright test runner is launched with the correct parameters
6. Test results are reported in the console and HTML report
