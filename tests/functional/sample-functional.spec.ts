import { test, expect } from '@playwright/test';
import { readConfig } from '../../utils/utils';

test('should display Playwright in the page title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});

test('should display logo on the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[data-action="Header Logo"].logo')).toBeVisible();
});

test('should hide cookie banner after accepting cookies', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#onetrust-banner-sdk')).toBeVisible();
  await page.locator('#onetrust-accept-btn-handler').click();
  await expect(page.locator('#onetrust-banner-sdk')).not.toBeVisible();
});

test('should be on the page with baseURL', async ({ page }, testInfo) => {
  const baseURL = readConfig('baseURL', testInfo);
  await page.goto('/');
  await expect(page).toHaveURL(`${baseURL}`);
});
