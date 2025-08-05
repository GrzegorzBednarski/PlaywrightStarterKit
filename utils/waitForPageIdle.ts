import { Page } from '@playwright/test';

/**
 * Waits until the page stops sending network requests for 500ms.
 * Uses `waitForLoadState('networkidle')` and additional timeout handling.
 *
 * @param page - The Playwright page object to wait for network idle state
 *
 * @example
 * ```typescript
 * await page.goto('/complex-page');
 * await waitForPageIdle(page);
 * ```
 *
 * @remarks
 * - First attempts to use Playwright's built-in `waitForLoadState('networkidle')`
 * - Falls back to manual network monitoring if no active navigation is detected
 * - Useful for pages with dynamic content loading or AJAX requests
 */
export async function waitForPageIdle(page: Page): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    await waitForManualNetworkIdle(page);
  }
}

/**
 * Manually checks if the page hasn't sent any requests for 500ms.
 * This function monitors network requests and waits for a quiet period.
 *
 * @param page - The Playwright page object to monitor for network activity
 *
 * @remarks
 * - Uses 500ms threshold for determining network idle state
 * - Polls every 250ms to check for recent network activity
 * - Automatically removes request listeners after completion
 */
async function waitForManualNetworkIdle(page: Page): Promise<void> {
  const idleThreshold = 500;
  let lastRequestTime = Date.now();

  page.on('request', () => {
    lastRequestTime = Date.now();
  });

  while (true) {
    await page.waitForTimeout(250);
    if (Date.now() - lastRequestTime > idleThreshold) break;
  }

  page.removeAllListeners('request');
}
