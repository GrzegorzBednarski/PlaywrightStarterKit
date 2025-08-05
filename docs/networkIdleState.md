# Network Idle State

← [Back to main documentation](../README.md)

When dealing with pages that load content dynamically via AJAX requests or have complex loading sequences, you may need to wait for the page to reach a stable state before interacting with elements. The `waitForPageIdle` utility function helps with this by waiting until no network requests have been sent for 500ms.

```ts
import { waitForPageIdle } from '../../utils/waitForPageIdle';

test('should interact with dynamically loaded content', async ({ page }) => {
  await page.goto('/complex-page');
  await waitForPageIdle(page);
  await page.locator('#dynamic-button').click();
});
```

This function first attempts to use Playwright's built-in `waitForLoadState('networkidle')` and falls back to manual network monitoring if no active navigation is detected.

**Visual Testing Recommendation:** It's particularly important to use `waitForPageIdle` before taking screenshots or performing visual tests to ensure all dynamic content has finished loading and the page is in a stable state for comparison.
