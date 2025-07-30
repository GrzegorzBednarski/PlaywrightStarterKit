import { test, expect } from '@playwright/test';
import { readConfig } from '../../utils/utils';
import { PAGES } from '../../data/paths';
import { COOKIE_PROMPT, NAVIGATION } from '../../data/selectors';

test('should display logo on the homepage', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);
  await expect(page.locator(NAVIGATION.VML_LOGO)).toBeVisible();
});

test('should hide cookie banner after accepting cookies', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);
  await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).toBeVisible();
  await page.locator(COOKIE_PROMPT.ACCEPT_ALL_COOKIES_BUTTON).click();
  await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).not.toBeVisible();
});

test('should be on the page with baseURL', async ({ page }, testInfo) => {
  const baseURL = readConfig('baseURL', testInfo);
  await page.goto(PAGES.HOMEPAGE);
  await expect(page).toHaveURL(`${baseURL}`);
});
