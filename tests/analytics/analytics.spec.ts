import { test } from '@playwright/test';
import { initAnalyticsSpy, checkAnalyticsEvent } from '../../utils/analytics';
import { PAGES } from '../../data/paths';
import { COOKIE_PROMPT } from '../../data/selectors';

test('should track analytics event after accepting all cookies', async ({ page }) => {
  await initAnalyticsSpy(page);
  await page.goto(PAGES.HOMEPAGE);
  await page.waitForSelector(COOKIE_PROMPT.ACCEPT_ALL_COOKIES_BUTTON);
  await page.click(COOKIE_PROMPT.ACCEPT_ALL_COOKIES_BUTTON);

  await checkAnalyticsEvent(page, 'acceptAllCookiesButtonClick', {
    '%VAL1%': 'granted',
    '%VAL2%': 'granted',
  });
});
