import { test, expect } from '@playwright/test';

test('should display Playwright in the page title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
