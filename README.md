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

## TypeScript

This project uses TypeScript for writing tests and configuration files. TypeScript provides static typing and improved code quality.

TypeScript configuration is located in the `tsconfig.json` file. You can adjust compiler options there to fit your needs.

All test files should use the `.ts` extension (e.g., `sample-functional.spec.ts`).

For more information about TypeScript, see:
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Playwright & TypeScript](https://playwright.dev/docs/test-typescript)
