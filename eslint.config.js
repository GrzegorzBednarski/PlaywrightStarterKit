const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const playwrightPlugin = require('eslint-plugin-playwright');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests');

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
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'error',
      'import/no-extraneous-dependencies': 'error',
      'no-only-tests/no-only-tests': 'error',
      'prettier/prettier': ['warn'],
    },
  },
];
