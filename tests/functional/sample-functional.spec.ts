import { test, expect } from '@playwright/test';
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

test('should be on the page with baseURL', async ({ page, baseURL }) => {
  await page.goto(PAGES.HOMEPAGE);
  await expect(page).toHaveURL(baseURL + PAGES.HOMEPAGE);
});

test('should display environment variables and config', async ({ baseURL }, testInfo) => {
  console.log('Project name:', testInfo.project.name);
  console.log('Project timeout:', testInfo.project.timeout);
  console.log('ENV:', process.env.ENV);
  console.log('PERCY_TOKEN:', process.env.PERCY_TOKEN);
  console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
  console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
  console.log('baseURL:', baseURL);
});
