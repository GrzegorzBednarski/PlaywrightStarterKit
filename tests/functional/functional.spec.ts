import { test, expect } from '@playwright/test';
import { PAGES } from '../../data/paths';
import { COOKIE_PROMPT, NAVIGATION } from '../../data/selectors';
import replaceText from '../../utils/replaceText';
import { setCookies } from '../../utils/setCookies';

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

test('should replace text using replaceText utility', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const uniqueText = `${timestamp}`;

  await expect(page.locator(NAVIGATION.CAREERS_LINK)).toHaveText('Careers');
  await replaceText(page, NAVIGATION.CAREERS_LINK, uniqueText);
  await expect(page.locator(NAVIGATION.CAREERS_LINK)).toHaveText(uniqueText);
});

test('should skip cookie banner when cookies are pre-set', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);
  await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).toBeVisible();

  await setCookies(page, ['COOKIE_CLOSED']);
  await page.goto(PAGES.HOMEPAGE);
  await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).not.toBeAttached();
});
