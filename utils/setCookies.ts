import { Page } from '@playwright/test';
import { COOKIES } from '../data/cookies';

/**
 * Sets predefined cookies in the current browser context using Playwright.
 * This utility allows tests to simulate specific user states (e.g. dismissed banners,
 * logged-in sessions, user preferences) by injecting cookies before page navigation.
 *
 * @param page - The Playwright `Page` object where cookies should be set
 * @param cookieKeys - Array of keys referencing cookies defined in the `COOKIES` object
 *
 * @example
 * ```ts
 * // Inject multiple cookies to skip banners and set preferences
 * await setCookies(page, ['COOKIE_BANNER_CLOSED', 'USER_PREFERENCES']);
 * await page.goto('/');
 * await expect(page.locator('#cookie-banner')).not.toBeVisible();
 * // Page should load with dark theme and English language
 * ```
 *
 * @example
 * ```ts
 * // Use predefined cookie scenario for a logged-in user
 * import { COOKIE_SCENARIOS } from '../data/cookieScenarios';
 * await setCookies(page, COOKIE_SCENARIOS.loggedInUser);
 * await page.goto('/dashboard');
 * // User is automatically logged in with preferences
 * ```
 *
 * @remarks
 * - Cookie definitions must exist in `data/cookies.ts` under the `COOKIES` object
 * - Keys passed to `setCookies` must match the keys of `COOKIES`
 * - Cookies are added to the browser context, not just the current page
 * - Use before `page.goto()` to ensure cookies are applied before page load
 * - Supports integration with `COOKIE_SCENARIOS` for reusable cookie combinations
 * - Recommended for test isolation and parallel-safe execution
 */
export async function setCookies(page: Page, cookieKeys: Array<keyof typeof COOKIES>) {
  const context = page.context();
  const cookieObjects = cookieKeys.map(key => COOKIES[key]);
  await context.addCookies(cookieObjects);
}
