import { test } from '@playwright/test';
import runAccessibilityScan from '../../utils/accessibility';
import { PAGES } from '../../data/paths';

test('Homepage accessibility', async ({ page }) => {
  await page.goto(PAGES.HOMEPAGE);
  await runAccessibilityScan(page);
});

test('[sanity] Careers page accessibility', async ({ page }) => {
  await page.goto(PAGES.CAREERS);
  await runAccessibilityScan(page, {
    tags: ['best-practice'],
    ignoredRules: {
      'landmark-banner-is-top-level': true,
    },
  });
});
