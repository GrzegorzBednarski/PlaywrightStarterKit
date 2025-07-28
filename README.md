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

To run tests for a specific environment, set the ENV variable (see [Environment Configuration](#environment-configuration)):

```sh
cross-env ENV=dev npx playwright test --ui
```

You can also add scripts to your `package.json` for convenience:

```json
"scripts": {
  "pw:run:dev": "cross-env ENV=dev npx playwright test --ui",
  "pw:run:stg": "cross-env ENV=stg npx playwright test --ui"
}
```

Then run:

```sh
npm run pw:run:dev
```

or

```sh
npm run pw:run:stg
```

### Running Functional Tests

To run only the functional tests located in the tests/functional folder:

```sh
npm run pw:run:functional
```

## Environment Configuration

PlaywrightStarterKit supports environment-specific configuration files for flexible test setups. All environment configs are stored in the `env/` directory and should follow the naming convention `.env.json` (e.g., `.dev.json`, `.stg.json`).

- **Do not commit sensitive environment files to the repository.**
- Only the `.example.json` file is tracked in Git and serves as a template for new environments.

### How to use environment configs

1. **Create your environment file:**
   - Copy `env/.example.json` to a new file, e.g., `env/.dev.json` or `env/.stg.json`.
   - Fill in the values for your environment (baseURL, users, etc.).

2. **Run tests with the desired environment:**
   - See [Running Tests for a Specific Environment](#running-tests-for-a-specific-environment) for instructions on how to run tests with a selected environment.
   - If you do not set the `ENV` variable or the file does not exist, Playwright will throw an error and point you to this section.

3. **Config structure:**
   - Each environment file should contain all necessary config values for your tests, e.g.:
     ```json
     {
       "baseURL": "https://your-env-url.com",
       "timeout": 8000,
       "use": {
         "users": {
           "admin": { "username": "...", "password": "..." },
           "customUser": { "username": "...", "password": "..." }
         }
       }
     }
     ```

4. **Best practices:**
   - Never commit real credentials or secrets.
   - Use `.example.json` as a template for new environments.
   - Document any custom config values in your team wiki or README.

For more details on accessing config values in tests, see the [Utilities](#utilities) section.

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

## Utilities

### readConfig - Helper for reading config values

The `readConfig` function (located in `utils/utils.ts`) allows you to easily access any nested value from your Playwright config using a dot-separated path string.

**Example usage:**
```ts
import { readConfig } from './utils/utils';

const baseURL = readConfig('baseURL', testInfo);
const adminUsername = readConfig('users.admin.username', testInfo);
```

**Parameters:**
- `path` – Dot-separated path to the property, e.g. `'baseURL'`, `'users.admin.username'`
- `testInfo` – The testInfo object provided by Playwright (available inside each test)

**Returns:**
- The value from config or `undefined` if not found

See the JSDoc in `utils/utils.ts` for more details.
