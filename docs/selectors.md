# Selectors

← [Back to main documentation](../README.md)

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
