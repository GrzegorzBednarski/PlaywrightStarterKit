import { test } from '@playwright/test';
import runAccessibilityScan from '../../utils/accessibility';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await runAccessibilityScan(page);
});

test('Careers page accessibility', async ({ page }) => {
  await page.goto('/careers');
  await runAccessibilityScan(page, {
    tags: ['best-practice'],
    ignoredRules: {
      'landmark-banner-is-top-level': true,
    },
  });
});
