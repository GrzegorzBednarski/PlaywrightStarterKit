# iFrames

← [Back to main documentation](../README.md)

In Playwright, you can interact with elements inside iframes using the `frameLocator` API. This allows you to easily locate and interact with elements within nested browsing contexts.

Sample usage:

```ts
// Locate the iframe by selector (e.g., title or other attribute)
const frame = page.frameLocator('iframe[title="Your Iframe Title"]');
// Interact with elements inside the iframe
await frame.locator('selector-inside-iframe').click();
await frame.locator('input[name="example"]').fill('value');
```

You can also assert the presence or visibility of elements inside iframes:

```ts
await expect(frame.locator('button[type="submit"]')).toBeVisible();
```

For more details, see the [Playwright documentation on frames](https://playwright.dev/docs/frames).
