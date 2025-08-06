# Test Configuration

← [Back to main documentation](../README.md)

## Overview

This guide covers advanced test configuration options in Playwright, including execution modes, timeouts, retries, and other test behavior settings.

## Test Execution Modes

### Serial Mode

Run tests sequentially instead of in parallel. Useful when tests need to run in a specific order or when they share resources.

```typescript
import { test } from '@playwright/test';

// Configure entire describe block to run serially
test.describe.configure({ mode: 'serial' });

test.describe('Sequential tests', () => {
  test('First test', async ({ page }) => {
    // This test runs first
    await page.goto('/setup');
    // Modify application state
  });
  
  test('Second test', async ({ page }) => {
    // This test runs after the first one completes
    await page.goto('/verify');
    // Verify state from previous test
  });
});
```

### Parallel Mode (Default)

Tests run in parallel by default. You can explicitly set it or override serial mode:

```typescript
test.describe.configure({ mode: 'parallel' });

test.describe('Independent tests', () => {
  test('Test A', async ({ page }) => {
    // Runs in parallel with Test B
  });
  
  test('Test B', async ({ page }) => {
    // Runs in parallel with Test A
  });
});
```

### When to Use Serial Mode

- **Performance tests** - Lighthouse audits should not run simultaneously
- **Database tests** - Tests that modify shared database state
- **Rate-limited APIs** - When testing against APIs with strict rate limits
- **Stateful applications** - Tests that depend on previous test outcomes
- **Resource-intensive tests** - When system resources are limited
- **Debugging** - Easier to trace issues when tests run sequentially

## Timeouts

### Global Timeout Configuration

Set timeouts for entire test suites:

```typescript
// In playwright.config.ts or test file
test.describe.configure({ 
  timeout: 60000,  // 60 seconds for entire test
  mode: 'serial' 
});
```

### Individual Test Timeouts

Override timeout for specific tests:

```typescript
test('Long-running test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes for this test only
  
  await page.goto('/slow-loading-page');
  // Test implementation
});
```

### Timeout Best Practices

- **Performance tests**: 60-120 seconds (Lighthouse audits are slow)
- **API tests**: 30-60 seconds (network dependency)
- **Unit-like tests**: 10-30 seconds (fast execution)
- **Integration tests**: 45-90 seconds (multiple system interactions)

## Test Retries

### Configure Retries for Flaky Tests

```typescript
test.describe.configure({ 
  retries: 2,  // Retry failed tests up to 2 times
  timeout: 30000 
});

test.describe('Flaky network tests', () => {
  test('API integration test', async ({ page }) => {
    // This test will retry up to 2 times if it fails
    await page.goto('/api-dependent-page');
  });
});
```

### Conditional Retries

```typescript
// Retry only in CI environment
test.describe.configure({ 
  retries: process.env.CI ? 2 : 0 
});
```

## Test Isolation

### Browser Context Isolation

```typescript
test.describe('Isolated test group', () => {
  test.beforeEach(async ({ context }) => {
    // Fresh context for each test
    await context.clearCookies();
    await context.clearPermissions();
  });
  
  test('Test with clean state', async ({ page }) => {
    // Guaranteed clean browser state
  });
});
```