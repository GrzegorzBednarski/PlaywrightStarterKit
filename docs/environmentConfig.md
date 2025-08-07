# Environment Configuration

← [Back to main documentation](../README.md)

## Overview

PlaywrightStarterKit uses two mechanisms for environment management:

1. **Project-based configuration in Playwright**
2. **Environment variables and secrets using dotenv** - [Detailed documentation](./dotenvConfig.md)

## Project-based Configuration

Non-secret values (e.g. baseURL, timeouts, browser settings) are defined in `playwright.config.ts` using the `projects` array:

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

This allows you to run tests for different environments by specifying the project name.

## Environment Variables and Secrets

Secret values (e.g. API tokens, credentials) are stored in `.env` files inside the `env/` directory (e.g. `env/.env.example`).

- The `config/dotenvConfig.ts` file loads the correct `.env` file based on the `ENV` variable (e.g. `ENV=example` loads `env/.env.example`).
- If the file for the selected environment does not exist, the fallback is set to `env/.env.example` (see `config/dotenvConfig.ts`). You can change this setting by editing the `fallbackName` variable in that file.
- All files in `env/` are ignored by git except for `env/.env.example`, which serves as an example for your environment variables.

Example `.env.example` file:
```dotenv
ENV=example
PERCY_TOKEN=xyz
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=super-secret
```

Dotenv is loaded automatically in your configuration, so you can use `process.env` in your tests and config files.

## How dotenv works in this project

- The configuration loads the correct `.env` file based on the `ENV` variable (e.g. `ENV=dev` loads `env/.env.dev`).
- If the file does not exist, it falls back to `env/.env.example` (see `config/dotenvConfig.ts`).
- You can change the default environment by editing the `fallbackName` variable in `config/dotenvConfig.ts`.
- All environment variables from the file are available via `process.env` in your tests and configuration.

## How to add a new environment

### 1. Add a new project in `playwright.config.ts`

Copy an existing project configuration and adjust its name and config values:
```ts
{
  name: 'STG',
  timeout: 30000,
  use: {
    baseURL: 'https://production.example.com',
  },
}
```

Remember this project name, as it will need to match in the test runner configuration.

### 2. Add a new secrets file to the `env/` directory

- Create a new file, e.g. `env/.env.stg`, and add your secret values
- Include required variables for visual testing:
  ```dotenv
  ENV=stg
  PERCY_TOKEN=xyz
  PERCY_BRANCH=main
  ```
- The file must include PERCY_TOKEN and PERCY_BRANCH if you plan to run visual tests
- Do not commit this file to git (it is ignored by default)

### 3. Add a new environment in `config/testRunnerConfig.js`

Add a new entry to the `environments` object that references your project and env file:
```js
environments: {
  dev: { env: 'dev', project: 'DEV' },
  qa: { env: 'qa', project: 'QA' },
  stg: { env: 'stg', project: 'STG' },
  // Add your new environment here
  prod: { env: 'prod', project: 'PROD' }
},
```

- The `env` property determines which `.env` file will be loaded (must match your file from step 2)
- The `project` property must match the project name you created in step 1

## How to use environment variables in tests

You can access any value from your `.env` file using `process.env`:
```ts
console.log(process.env.ADMIN_USERNAME);
console.log(process.env.PERCY_TOKEN);
```

## How to use config values in tests

You can access config values (like timeout, baseURL, or custom values) from the current project using the `testInfo.project` object or Playwright's test context:
```ts
test('should use config values', async ({ page }, testInfo) => {
  console.log('Project name:', testInfo.project.name);
  console.log('Project timeout:', testInfo.project.timeout);
  console.log('Project baseURL:', testInfo.project.use.baseURL);
});
```

This is useful for debugging or for writing tests that depend on project-specific configuration.

## Best practices

- Never commit real secrets or credentials to the repository.
- Use `env/.env.example` as a template for new environments and document required variables.
- Store non-secret config in `playwright.config.ts` projects, and secrets in `env/.env.*` files.
