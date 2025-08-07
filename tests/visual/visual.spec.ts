import { PAGES } from '../../data/paths';
import { expect, test } from '@playwright/test';
import { setCookies } from '../../utils/setCookies';
import percySnapshot from '@percy/playwright';
import { waitForPageIdle } from '../../utils/waitForPageIdle';
import { COOKIE_PROMPT } from '../../data/selectors';

test('Visual - Careers', async ({ page }) => {
  await setCookies(page, ['COOKIE_CLOSED']);
  await page.goto(PAGES.CAREERS);
  await waitForPageIdle(page);
  await expect(page.locator(COOKIE_PROMPT.COOKIE_BANNER)).not.toBeAttached();
  await percySnapshot(page, 'Careers');
});
