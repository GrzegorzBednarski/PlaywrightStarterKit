# ESLint

← [Back to main documentation](../README.md)

ESLint is used for static code analysis and enforcing code quality. It helps catch potential bugs, enforce coding standards, and maintain consistent code style across the project.

## Configuration

ESLint configuration is located in the `eslint.config.js` file using the modern flat config format.

**Example configuration (`eslint.config.js`):**

```javascript
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const playwrightPlugin = require('eslint-plugin-playwright');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');

/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  {
    ignores: ['node_modules/', 'dist/', '*.min.js', 'eslint.config.js'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        NodeJS: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      'no-only-tests': noOnlyTestsPlugin,
      playwright: playwrightPlugin,
      prettier: prettierPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'error',
      'import/no-extraneous-dependencies': 'warn',
      'no-only-tests/no-only-tests': 'error',
      'prettier/prettier': 'warn',
    },
  },
];
```

**Key configuration features:**

- **Flat config format**: Uses modern ESLint flat configuration
- **TypeScript support**: Full TypeScript parsing and rules via `@typescript-eslint`
- **Playwright integration**: Specific rules for Playwright test files
- **Import validation**: Checks for proper import/export usage
- **Test quality**: Prevents committing `test.only()` calls
- **Prettier integration**: Ensures code formatting consistency

**Plugins used:**
- `@typescript-eslint` - TypeScript-specific linting rules
- `eslint-plugin-playwright` - Playwright test best practices
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-no-only-tests` - Prevents `.only()` in tests
- `eslint-plugin-prettier` - Integration with [Prettier](./prettier.md)
- `eslint-plugin-unused-imports` - Automatically detects and removes unused imports

## Usage

To manually run ESLint and automatically fix issues, use:

```sh
npm run pw:eslint
```

**Automatic linting:** ESLint runs automatically on staged files before commits thanks to [lint-staged](./lintStaged.md) and [Husky](./husky.md) integration.

## Integration with other tools

ESLint works seamlessly with:
- **[Prettier](./prettier.md)** - Code formatting
- **[TypeScript](./typescript.md)** - Type checking and TS-specific rules
- **[Lint-staged](./lintStaged.md)** - Pre-commit linting
- **[Husky](./husky.md)** - Git hooks management

For more information about ESLint, see:

- [ESLint Documentation](https://eslint.org/docs/user-guide/configuring/rules)
