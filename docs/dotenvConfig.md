# Dotenv Configuration

← [Back to main documentation](../README.md) | [Environment Configuration](./environmentConfig.md)

## Overview

The PlaywrightStarterKit uses [dotenv](https://www.npmjs.com/package/dotenv) to manage environment-specific configuration and secrets. This allows you to maintain different sets of environment variables for different environments (development, QA, staging, production) without committing sensitive information to version control.

## Implementation Details

The dotenv configuration is handled by the `config/dotenvConfig.ts` file, which automatically loads the appropriate environment file based on the current context.

```typescript
// Simplified excerpt from config/dotenvConfig.ts
const fallbackName = 'example';
const envFile = `env/.env.${process.env.ENV || fallbackName}`;
const fallbackFile = `env/.env.${fallbackName}`;

// Load environment file or fallback to example if not found
```

### Key Features

1. **Environment-specific files**: Loads `.env` files based on the `ENV` variable (e.g., `ENV=dev` loads `env/.env.dev`)
2. **Automatic fallback**: If the specified environment file doesn't exist, falls back to `env/.env.example`
3. **Startup validation**: Ensures at least one valid environment file exists before tests run
4. **Debug logging**: Provides clear console messages when falling back to default environment

## File Structure

Environment files should be placed in the `env/` directory following this naming pattern:
```
env/
  .env.dev
  .env.qa
  .env.stg
  .env.prod
  .env.example (fallback & template)
```

Only `.env.example` should be committed to version control. All other `.env.*` files are git-ignored to protect sensitive information.

## Configuration Options

The `dotenvConfig.ts` file offers these customization points:

- **`fallbackName`**: The name of the default environment file to use if the specified one doesn't exist
- File paths and error messages can be customized by editing the configuration file

## Usage

### Setting the Current Environment

The environment is selected by setting the `ENV` variable before running tests:

```bash
# Explicitly set environment
ENV=qa npm run pw:test qa functional

# Using test runner (sets ENV automatically)
npm run pw:test qa functional
```

### Accessing Environment Variables

Once loaded, environment variables are available throughout your tests via `process.env`:

```typescript
test('should use credentials from env file', async ({ page }) => {
  await page.fill('#username', process.env.ADMIN_USERNAME);
  await page.fill('#password', process.env.ADMIN_PASSWORD);
});
```

### Creating New Environment Files

1. Copy the template: `cp env/.env.example env/.env.myenv`
2. Edit the file with your environment-specific values
3. Run tests using your new environment: `npm run pw:test myenv functional`

## Best Practices

1. **Never commit real credentials**: Keep all `.env.*` files (except `.env.example`) in `.gitignore`
2. **Document required variables**: Keep `.env.example` up-to-date with all required variables
3. **Use descriptive variable names**: Prefix variables with their purpose, e.g., `DB_USERNAME`, `API_KEY`
4. **Validate on startup**: The framework validates that required environment files exist
5. **Consider encryption**: For highly sensitive environments, consider encrypting `.env` files

## Related Documentation

- [Environment Configuration](./environmentConfig.md) - General environment management
- [Test Runner Configuration](./testRunner.md) - How environments are used in test execution
