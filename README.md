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
  "pw:run:example": "cross-env ENV=example npx playwright test",
  "pw:open:example": "cross-env ENV=example npx playwright test --ui",
  "pw:run:functional:example": "cross-env ENV=example npx playwright test tests/functional"
}
```

To run tests, use one of the following commands:

```sh
npm run pw:run:example           # Run all tests in CLI mode
npm run pw:open:example          # Run all tests in Playwright UI mode
npm run pw:run:functional:example # Run only functional tests
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

### Running Functional Tests

To run only the functional tests located in the tests/functional folder:

```sh
npm run pw:run:functional
```

## Test Reports

All reporter output files are configured to be saved in the `build` folder, as defined in `playwright.config.ts`. This folder is used for CI/CD integration and is ignored by git.

PlaywrightStarterKit supports multiple reporting formats to help you analyze test results.

### Built-in HTML Reporter

Playwright includes a built-in HTML reporter that generates a visual report after test execution.

**Note:** The HTML reporter is already configured in this project and will be used automatically after running tests. You do not need to specify `--reporter=html` manually.

**Example configuration:**
```ts
reporter: [
  ['html', { outputFolder: 'build/html-report', open: 'never' }],
]
```

To view the report, use the provided script:

```sh
npm run pw:report
```

This will open the generated file in `build/html-report/index.html` after your test run.

### JSON / JUnit Reporters
For CI/CD integration or custom dashboards, you can use other reporters like `json` or `junit`.

**Example configuration:**
```ts
reporter: [
  ['json', { outputFile: 'build/json/results.json' }],
  ['junit', { outputFile: 'build/junit/results.xml' }],
]
```

These files can be parsed by CI tools like Jenkins, GitHub Actions, or Azure DevOps.

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
   - The `config/dotenv.ts` file loads the correct `.env` file based on the `ENV` variable (e.g. `ENV=example` loads `env/.env.example`).
   - If the file for the selected environment does not exist, the fallback is set to `env/.env.example` (see `config/dotenv.ts`). You can change the fallback by editing the `fallbackName` variable in that file.
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
- If the file does not exist, it falls back to `env/.env.example` (see `config/dotenv.ts`).
- You can change the fallback environment by editing the `fallbackName` variable in `config/dotenv.ts`.
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

### Main config - [documentation](https://playwright.dev/docs/test-configuration)
General configuration is set in the `playwright.config.ts` file. This file contains global settings such as timeouts, parallelism, baseURL, and other options that apply to all tests by default.

### Overwriting config values - [documentation](https://playwright.dev/docs/test-configuration#overriding-configuration)
You can overwrite specific configuration parameters by passing them via the command line interface (CLI) or by using environment-specific config files. This allows you to change settings for a single test run without modifying the main configuration file.

For example, you can set the environment using the `ENV` variable to load a specific config file for development, staging, or production (see the [Environment Configuration](#environment-configuration) section for more details). This is useful for managing settings that vary between different environments.

You can also override some Playwright options directly in the CLI, e.g.:

```sh
npx playwright test --grep "@smoke" --workers=2
```

This flexibility allows you to tailor test runs to your needs without changing the main config file.

### Analytics Configuration
Configuration for analytics spying is defined in `config/analyticsConfig.ts`.
This file controls how analytics events are captured and filtered during tests.

**Example structure:**
```ts
export const analyticsConfig = {
  source: 'dataLayer', // name of the global array used for analytics
  debugAnalytics: 'ifFail', // 'always' | 'never' | 'ifFail'
  enableFiltering: true,
  filterKey: 'event:pageEvent', // 'key' | 'value' | 'key:value'
};
```

- **source**: name of the global array (e.g., `dataLayer`) where events are pushed.
- **debugAnalytics**: controls logging behavior:
  - `'always'`: log all matching events
  - `'never'`: disable logging
  - `'ifFail'`: log only when `checkAnalyticsEvent` fails
- **enableFiltering**: whether to filter events using `filterKey`
- **filterKey**: string used to match events (e.g., `event:pageEvent`)

See [Analytics Usage](#analytics) for examples of how to use this configuration in tests.

### ESLint - [documentation](https://eslint.org/docs/user-guide/configuring/rules)

ESLint is used for static code analysis and enforcing code quality. You can change its configuration in the `eslint.config.js` file.

To manually run ESLint and automatically fix issues, use:

```sh
npm run pw:eslint
```

### Husky - [documentation](https://typicode.github.io/husky/#/)

Husky is used to manage Git hooks and automate tasks like linting and formatting before commits. It helps enforce code quality by running tools such as lint-staged automatically.

After cloning the repository and running `npm install` or `npm ci`, Husky will be set up automatically (thanks to the `prepare` script in `package.json`). No additional manual steps are required for contributors.

#### Pre-commit hook for monorepo

The `.husky/pre-commit` script is prepared to support both single-repo and monorepo setups. To add more packages in a monorepo, simply update the `packages` array in `.husky/pre-commit`:

```sh
packages=("./" "packages/app1" "packages/app2")
```

This will run lint-staged in each specified package directory before every commit, ensuring code quality across all parts of the monorepo.

You can add more hooks or customize existing ones by editing or adding scripts in the `.husky/` directory.


### Lint-staged - [documentation](https://github.com/okonet/lint-staged)

Lint-staged runs a set of predefined actions only on files that have been changed and staged in Git before a commit. This ensures that only the changes you're about to commit are checked and processed by the linters and formatters, helping to keep the codebase clean and consistent.

We use it to run ESLint and Prettier automatically on staged files (see the `lint-staged` section in `package.json`).

### Prettier - [documentation](https://prettier.io/docs/en/options.html)

Prettier is a code formatter tool. You can change its configuration in the `.prettierrc` file.

To manually format all `.js` and `.ts` files, run:

```sh
npm run pw:prettier
```

You can adjust these settings in `.prettierrc` to fit your team's preferences.

### TypeScript

This project uses TypeScript for writing tests and configuration files. TypeScript provides static typing and improved code quality.

TypeScript configuration is located in the `tsconfig.json` file. You can adjust compiler options there to fit your needs.

All test files should use the `.ts` extension (e.g., `sample-functional.spec.ts`).

For more information about TypeScript, see:
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Playwright & TypeScript](https://playwright.dev/docs/test-typescript)

## Usage

### Analytics
We provide two helper functions to verify if analytics events are correctly pushed to the data layer.

The first function, `initAnalyticsSpy`, injects a spy into the page and starts capturing analytics events. It should be called before any user interactions that trigger analytics.

The second function, `checkAnalyticsEvent`, compares the captured events with the expected result defined in a fixture file.

**Example usage**
```ts
import { test } from '@playwright/test';
import { initAnalyticsSpy, checkAnalyticsEvent } from './helpers/analytics';

test('Check analytics after clicking the logo', async ({ page }) => {
  await page.goto('http://www.example.com');
  await initAnalyticsSpy(page);
  await page.locator('#logo').click();
  await checkAnalyticsEvent(page, 'clicks/logo');
});
```

In the example above, we first navigate to the page and initialize the analytics spy. Then we perform an action (clicking the logo), and finally verify that the expected analytics event was captured.

**Example fixture file**
Located under `fixtures/analytics/clicks/logo.json`:
```json
{
  "event": "pageEvent",
  "actionType": "click",
  "clickType": "internal",
  "pageElement": {
    "siteSection": "MastHead TopNav",
    "elementLayer1": "top-navigation",
    "elementLayer2": "image",
    "itemIdentifier": "Brand logo"
  }
}
```

**Dynamic placeholders**
If your expected analytics event contains dynamic values (e.g., URL or element name), you can use placeholders in the fixture file and pass replacements to `checkAnalyticsEvent`.

**Example fixture file with placeholders:**
```json
{
  "event": "pageEvent",
  "actionType": "click",
  "clickType": "internal",
  "pageElement": {
    "siteSection": "MastHead MegaMenu",
    "elementLayer1": "snippet reference-megamenu-v2-tablet-variant-disabled",
    "elementLayer2": "megamenu",
    "elementLayer3": "richtext",
    "itemIdentifier": "%NAME%",
    "internalDestination": "%URL%"
  }
}
```

**Example usage with replacements:**
```ts
test('Check analytics after clicking dynamic link', async ({ page }) => {
  const link = page.locator('a.dynamicTitle');
  const url = await link.getAttribute('href');
  const title = await link.textContent();

  await checkAnalyticsEvent(page, 'clicks/dynamic-title', {
    '%URL%': url!,
    '%NAME%': title!,
  });
});
```

In this example, we extract dynamic values from the page and pass them as replacements to match the expected analytics event.
For configuration details, see [Analytics Confiduration](#analytics-configuration).

### iFrames

In Playwright, you can interact with elements inside iframes using the `frameLocator` API. This allows you to easily locate and interact with elements within nested browsing contexts.

Sample usage:

```ts
// Locate the iframe by selector (e.g., title or other attribute)
const frame = page.frameLocator('iframe[title="Your Iframe Title"]');
// Interact with elements inside the iframe
await frame.locator('selector-inside-iframe').click();
await frame.locator('input[name="example"]').fill('value');
```

You can also assert the presence or visibility of elements inside iframes:

```ts
await expect(frame.locator('button[type="submit"]')).toBeVisible();
```

For more details, see the [Playwright documentation on frames](https://playwright.dev/docs/frames).

### Paths

We can store all needed paths to pages that we will use during our tests in the `data/paths.ts` file.

```ts
export const PAGES = {
  HOMEPAGE: '/',
  ABOUT: '/about-us',
};
```

Then use it in your test-spec file, for example:

```ts
import { PAGES } from '../../data/paths';
// ...
await page.goto(PAGES.HOMEPAGE);
// ...
```

This approach helps keep your test code clean and makes it easy to update paths in one place if they change.

### Selectors

You can store all selectors used in your tests in the `data/selectors.ts` file. This helps keep your test code clean and maintainable by centralizing selector management.

Example structure:

```ts
export const COOKIE_PROMPT = {
  ACCEPT_ALL_COOKIES_BUTTON: '#onetrust-accept-btn-handler',
  COOKIE_BANNER: '#onetrust-banner-sdk',
};

export const NAVIGATION = {
  VML_LOGO: 'a[data-action="Header Logo"].logo',
};
```

Then use only the sections you need in your test-spec file:

```ts
import { COOKIE_PROMPT, NAVIGATION } from '../../data/selectors';

// ...
await expect(page.locator(NAVIGATION.VML_LOGO)).toBeVisible();
await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).toBeVisible();
// ...
```

This approach makes it easy to update selectors in one place if they change, and keeps your test files focused on logic, not selectors.
