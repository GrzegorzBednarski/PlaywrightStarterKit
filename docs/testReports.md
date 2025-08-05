# Test Reports

← [Back to main documentation](../README.md)

The `build` folder is automatically cleaned before each test run by the global setup script (see `global-setup.ts`). This ensures that reports and artifacts are always generated in a fresh directory, regardless of the number of workers or CI/CD environment.

All reporter output files are configured to be saved in the `build` folder, as defined in `playwright.config.ts`. This folder is used for CI/CD integration and is ignored by git.

PlaywrightStarterKit supports multiple reporting formats to help you analyze test results.

## List Reporter (Console Output)

The list reporter provides real-time console output showing test progress and results.

**Features:**
- Shows test execution progress in real-time
- Displays passed tests with ✓ green checkmarks
- Shows failed tests with ✗ red crosses and error details
- Provides a summary of total tests run, passed, failed, and skipped

**Example configuration:**

```ts
reporter: [
  ['list'], // Console output with test results
  // ... other reporters
];
```

**Console output example:**
```
✓ Homepage accessibility (2.1s)
✗ Login form validation (1.8s)
✓ Navigation menu functionality (0.9s)

3 passed (4.8s)
1 failed (1.8s)
```

## Built-in HTML Reporter

Playwright includes a built-in HTML reporter that generates a visual report after test execution.

**Note:** The HTML reporter is already configured in this project and will be used automatically after running tests. You do not need to specify `--reporter=html` manually.

**Features:**
- Interactive web interface for viewing test results
- Screenshots and videos of failed tests
- Detailed test execution traces
- Filterable and searchable test results

**Example configuration:**

```ts
reporter: [
  ['html', { outputFolder: 'build/html-report', open: 'never' }]
];
```

To view the HTML report, use the provided script:

```sh
npm run pw:report
```

This will open the generated file in `build/html-report/index.html` after your test run.

## JSON Reporter

The JSON reporter generates machine-readable test results for integration with custom dashboards or CI/CD tools.

**Features:**
- Complete test results in JSON format
- Detailed timing information
- Error messages and stack traces
- Attachment paths (screenshots, videos, traces)

**Example configuration:**

```ts
reporter: [
  ['json', { outputFile: 'build/json/results.json' }]
];
```

**Use cases:**
- Custom dashboard integration
- Test result analysis scripts
- CI/CD pipeline integration
- Historical test data storage

## JUnit Reporter

The JUnit reporter generates XML reports compatible with CI/CD tools like Jenkins, GitHub Actions, and Azure DevOps.

**Features:**
- XML format compatible with JUnit standard
- Integration with CI/CD reporting systems
- Test execution timing
- Failure details and error messages

**Example configuration:**

```ts
reporter: [
  ['junit', { outputFile: 'build/junit/results.xml' }]
];
```

**Compatible tools:**
- Jenkins
- GitHub Actions
- Azure DevOps
- GitLab CI
- TeamCity

## Multiple Reporters Configuration

This project is configured to generate all report types simultaneously for different use cases:

```ts
reporter: [
  ['list'],                                                    // Console output
  ['html', { outputFolder: 'build/html-report', open: 'never' }], // Visual inspection
  ['junit', { outputFile: 'build/junit/results.xml' }],          // CI/CD integration
  ['json', { outputFile: 'build/json/results.json' }],           // Custom processing
];
```

This approach provides:
- **Real-time feedback** via list reporter
- **Visual analysis** via HTML reporter
- **CI/CD integration** via JUnit reporter
- **Custom processing** via JSON reporter

For more information about Playwright reporters, see:

- [Playwright Reporters Documentation](https://playwright.dev/docs/test-reporters)
