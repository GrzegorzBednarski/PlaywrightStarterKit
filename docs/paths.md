# Paths

← [Back to main documentation](../README.md)

We can store all needed paths to pages that we will use during our tests in the `data/paths.ts` file.

```ts
export const PAGES = {
  HOMEPAGE: '/',
  ABOUT: '/about-us',
};
```

Then use it in your test-spec file, for example:

```ts
import { PAGES } from '../../data/paths';
// ...
await page.goto(PAGES.HOMEPAGE);
// ...
```

This approach helps keep your test code clean and makes it easy to update paths in one place if they change.
