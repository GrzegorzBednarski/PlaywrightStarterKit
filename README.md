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

To run all tests from the command line:

```sh
npx playwright test
```

To run all tests in Playwright's interactive UI mode:

```sh
npx playwright test --ui
```

### Running Functional Tests

To run only the functional tests located in the tests/functional folder:

```sh
npm run pw:run:functional
```

## Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)

## Configuration

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