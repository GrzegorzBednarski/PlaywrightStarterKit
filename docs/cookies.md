# Cookies Management

← [Back to main documentation](../README.md)

## Overview

The cookies management system provides an easy way to inject predefined cookies into your tests. This is useful for bypassing cookie banners, setting user preferences, or simulating logged-in states without manual interactions.

## Configuration

Pre-defined cookies are located in `data/cookies.ts`:

```typescript
export const COOKIES = {
  COOKIE_BANNER_CLOSED: {
    name: 'OptanonAlertBoxClosed',
    value: '1',
    domain: '.example.com',
    path: '/',
    httpOnly: false,
    secure: false,
  },
  
  NOTIFICATION_BANNER_CLOSED: {
    name: 'suppressLoginNotifications',
    value: 'closed',
    domain: '.example.com',
    path: '/',
    httpOnly: false,
    secure: false,
  },
  
  USER_PREFERENCES: {
    name: 'userPreferences',
    value: JSON.stringify({ theme: 'dark', language: 'en' }),
    domain: '.example.com',
    path: '/',
    httpOnly: false,
    secure: true,
  },
  
  SESSION_TOKEN: {
    name: 'sessionToken',
    value: 'abc123xyz',
    domain: '.example.com',
    path: '/',
    httpOnly: true,
    secure: true,
  },
};
```

## Usage

### Recommended Approach: Per-Test Cookies

Use `setCookies(page, [...])` to inject cookies into the test's isolated browser context. Pass an array of cookie keys (strings) that reference the cookies defined in `data/cookies.ts`.

```typescript
import { test, expect } from '@playwright/test';
import { setCookies } from '../utils/setCookies';

test('Skip cookie banner with pre-set cookies', async ({ page }) => {
  // Set cookies before navigating to page - use cookie KEYS as strings
  await setCookies(page, ['COOKIE_BANNER_CLOSED']);
  
  await page.goto('/');
  
  // Cookie banner should not appear
  await expect(page.locator('#cookie-banner')).not.toBeVisible();
});

test('Set multiple cookies for clean environment', async ({ page }) => {
  await setCookies(page, [
    'COOKIE_BANNER_CLOSED',
    'NOTIFICATION_BANNER_CLOSED',
    'USER_PREFERENCES'
  ]);
  
  await page.goto('/profile');
  // Page loads without popups and with user preferences
});
```

### Alternative: Global Cookies (Not Recommended)

Using `beforeAll` for global cookies is **not recommended**. This method may cause flaky tests in parallel execution. Prefer `setCookies(page, [...])` for reliability.

```typescript
// ❌ Not recommended - may cause issues in parallel execution
test.describe('Potentially flaky approach', () => {
  test.beforeAll(async ({ browser }) => {
    // This might interfere with other parallel tests
    const context = await browser.newContext();
    // Manual cookie setting - not using our setCookies function
  });
});
```

## Adding New Cookies

Add new cookie definitions to `data/cookies.ts`:

```typescript
export const COOKIES = {
  // ...existing cookies...
  
  NEW_FEATURE_FLAG: {
    name: 'featureFlag',
    value: 'enabled',
    domain: '.example.com',
    path: '/',
    httpOnly: false,
    secure: true,
  },
};
```

Then use it in tests by referencing the key:

```typescript
await setCookies(page, ['COOKIE_BANNER_CLOSED', 'NEW_FEATURE_FLAG']);
```

## Best Practices

1. **Use `setCookies(page, [...])` for all scenarios** - Ensures test isolation and parallel safety
2. **Set cookies before navigation** - Always call `setCookies()` before `page.goto()`
3. **Test cookie behavior** - Verify that cookies actually affect page behavior
4. **Use meaningful cookie names** - Make cookie purposes clear in `COOKIES` object
5. **Avoid global cookies** - They can cause flaky tests in parallel execution

## Cookie Scenarios

For complex testing scenarios, you can create predefined cookie combinations in `data/cookieScenarios.ts`:

### Creating Cookie Scenarios

Create a new file `data/cookieScenarios.ts`:

```typescript
import { COOKIES } from './cookies';

export const COOKIE_SCENARIOS = {
  cleanPage: [
    'COOKIE_BANNER_CLOSED',
    'NOTIFICATION_BANNER_CLOSED',
  ] as Array<keyof typeof COOKIES>,
  
  loggedInUser: [
    'SESSION_TOKEN',
    'USER_PREFERENCES',
  ] as Array<keyof typeof COOKIES>,
  
  fullUserExperience: [
    'COOKIE_BANNER_CLOSED',
    'NOTIFICATION_BANNER_CLOSED',
    'SESSION_TOKEN',
    'USER_PREFERENCES',
  ] as Array<keyof typeof COOKIES>,
  
  privacyMode: [
    'COOKIE_BANNER_CLOSED',
    // No tracking or session cookies
  ] as Array<keyof typeof COOKIES>,
};
```

### Using Cookie Scenarios

Import and use predefined scenarios in your tests:

```typescript
import { test, expect } from '@playwright/test';
import { setCookies } from '../utils/setCookies';
import { COOKIE_SCENARIOS } from '../data/cookieScenarios';

test('Clean page without popups', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.cleanPage);
  await page.goto('/');
  // Page loads without any interruptions
});

test('Authenticated user experience', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.loggedInUser);
  await page.goto('/dashboard');
  // User is automatically logged in with preferences
});

test('Complete user setup', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.fullUserExperience);
  await page.goto('/');
  // Clean page with authenticated user and preferences
});
```

### Advanced Cookie Scenarios

Create meaningful scenarios that group related cookies together:

```typescript
// Skip All Popups and Banners
test('Clean browsing experience', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.cleanPage);
  await page.goto('/');
  // Page loads without any interruptions
});

// Simulate Different User States
test('Privacy-conscious user', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.privacyMode);
  await page.goto('/');
  // Only essential cookies are set
});

test('Returning authenticated user', async ({ page }) => {
  await setCookies(page, COOKIE_SCENARIOS.fullUserExperience);
  await page.goto('/');
  // User has full personalized experience
});
```

## How It Works

The `setCookies` function:

1. **Accepts cookie keys** - Takes an array of string keys that reference cookies in the `COOKIES` object
2. **Maps to cookie objects** - Internally converts keys to full cookie objects using `COOKIES[key]`
3. **Injects into context** - Uses `page.context().addCookies()` to set them
4. **Provides type safety** - TypeScript ensures only valid cookie keys from `COOKIES` are used

```typescript
// This will work (using cookie keys as strings):
await setCookies(page, ['COOKIE_BANNER_CLOSED']);

// This will cause TypeScript error (invalid key):
await setCookies(page, ['INVALID_COOKIE']); // ❌ Type error

// This will also cause TypeScript error (using object instead of key):
await setCookies(page, [COOKIES.COOKIE_BANNER_CLOSED]); // ❌ Type error
```
